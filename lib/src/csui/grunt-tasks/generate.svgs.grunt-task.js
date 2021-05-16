/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

'use strict';

module.exports = function (grunt) {
  const svgson = require('svgson');
  const path = require('path');
  const fs = require('fs');
  const {promisify} = require('util');
  const readdir = promisify(fs.readdir);
  const mkdir = promisify(fs.mkdir);
  const rmdir = promisify(fs.rmdir);
  const unlink = promisify(fs.unlink);
  const stat = promisify(fs.stat);
  const copyFile = promisify(fs.copyFile);
  const _ = require('underscore');

  function readFile(path, opts = 'utf8') {
    return new Promise((resolve, reject) => {
      fs.readFile(path, opts, function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  function writeFile(path, data, opts = 'utf8') {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, opts, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  function parseStyles(stylesStr) {
    let allStyles = stylesStr.split(';');
    let styles = {};
    for (let k = 0; k < allStyles.length; k++) {
      if (allStyles[k]) {
        let keyValue = allStyles[k].split(':');
        styles[keyValue[0].trim()] = keyValue[1].trim();
      }
    }
    return styles;
  }

  function expandShorthandHexColor(colorString) {
    let expandedColorString = '#';
    if (colorString && colorString.length === 4 && colorString[0] === '#') {
      for (let i = 1; i < colorString.length; i++) {
        expandedColorString = expandedColorString + colorString[i] + colorString[i];
      }
    } else {
      expandedColorString = colorString;
    }
    return expandedColorString;
  }

  function addToClassMapping(srcClassName, targetClassName, ids) {
    if (srcClassName) {
      if (ids[srcClassName]) {
        ids[srcClassName].push(targetClassName);
      } else {
        ids[srcClassName] = [targetClassName];
      }
      return true;
    } else {
      return false;
    }
  }

  function replaceClassByInlineStyles(nodeAttributes, styles) {
    let c = nodeAttributes.class;
    let stylesForClass = styles[c];
    for (let i = 0; i < Object.keys(stylesForClass).length; i++) {
      const styleName = Object.keys(stylesForClass)[i];
      const styleValue = stylesForClass[styleName];
      if (nodeAttributes[styleName]) {
        grunt.log.warn(
            `Replacing style ${styleName}. Old value: ${nodeAttributes[styleName]}, new value: ${styleValue}. (this was not expected - you should investigate)`);
      }
      nodeAttributes[styleName] = styleValue;
    }
    delete nodeAttributes.class;
  }

  async function createClassMappings(svgStr) {
    let ids = {};
    const svgAst1 = await svgson.parse(svgStr, {
      transformNode: function (node) {
        if (node.type === "element" && node.attributes && node.attributes.id) {
          const id = node.attributes.id;
          switch (id) {
          case 'state':
          case 'focus':
            if (node.attributes.class) {
              ids[node.attributes.class] = id;
            }
            break;
          case 'metaphor':
            let cnt = 0;
            if (node.attributes.class) {
              ids[node.attributes.class] = id + cnt;
              cnt++;
            }
            if (node.children) {
              for (let ci = 0; ci < node.children.length; ci++) {
                let child = node.children[ci];
                if (child.type === 'element' && child.attributes) {
                  if (!ids[child.attributes.class]) {
                    ids[child.attributes.class] = id + cnt;
                    cnt++;
                  }
                }
              }
            }
            break;
          } // switch
        }
      } // transformNode
    });
    return ids;
  }

  async function getStylesForClasses(svgStr) {
    let regex = /\.(.*)\{(.*)\}/g;
    let styles = {};
    const svgAst1 = await svgson.parse(svgStr, {
      transformNode: function (node) {
        if (node.type === "element" && node.name === "style") {
          let newChildren = [];
          for (let k = 0; node.children && k < node.children.length; k++) {
            let child = node.children[k];
            let all = child.value;
            let allParts = all.split('}.');
            for (let i = 0; i < allParts.length; i++) {
              let part = allParts[i];
              if (!part.endsWith('}')) {
                part = part + '}';
              }
              let c = part[0];
              if (c !== '.' && c !== '\n' && c !== '\r' && c !== '\t' ) {
                part = '.' + part;
              }
              let matches;
              do {
                matches = regex.exec(part);
                if (matches && matches.length === 3) {
                  let selector = matches[1].trim();
                  styles[selector] = parseStyles(matches[2]);
                }
              } while (matches);
            }
          }
        }
      } // transformNode
    });
    return styles;
  }

  async function convertClassesToInlineStyles(parsedPath, src, dest, suffix, iconStates, sourceStylesByClasses,
      classMappingToNormalizedClassNames,
      svgStr) {
    for (let j = 0; j < Object.keys(iconStates).length; j++) {
      try {
        let state = Object.keys(iconStates)[j];

        let stateSuffix = '';
        if (state !== 'normal') {
          stateSuffix = '~' + state;
        }
        let targetStyles = iconStates[state];

        let targetFilename = parsedPath.name + suffix + stateSuffix + parsedPath.ext;
        let targetPath = path.join(dest, targetFilename);
        grunt.log.debug(`target: ${targetPath}`);

        let regex = /\.(.*)\{(.*)\}/g;
        const svgAst1 = await svgson.parse(svgStr, {
          transformNode: function (node) {
            if (node.type === "element") {
              switch (node.name) {
              case "style":
                break;
              default:
                if (node.attributes) {
                  let inlineStyles = JSON.parse(JSON.stringify(sourceStylesByClasses));  // deep clone
                  if (node.attributes.id) {
                    const id = node.attributes.id;
                    switch (id) {
                    case 'state':
                    case 'focus':
                    case 'metaphor':
                      for (let i = 0; i < Object.keys(inlineStyles).length; i++) {
                        let c = Object.keys(inlineStyles)[i];
                        let inlineStyle = inlineStyles[c];
                        let normalizedClassName = classMappingToNormalizedClassNames[c];
                        let newStyles = targetStyles[normalizedClassName];
                        if (newStyles) {
                          for (let k = 0; k < Object.keys(newStyles).length; k++) {
                            let style = Object.keys(newStyles)[k];
                            let styleValue = newStyles[style];
                            inlineStyle[style] = styleValue;
                          }
                        } else {
                          grunt.log.debug(`No target styles for class ${normalizedClassName} in state ${state}`);
                        }
                      }
                      break;
                    }
                    delete node.attributes.id;
                  }
                  if (node.attributes.class) {
                    replaceClassByInlineStyles(node.attributes, inlineStyles);
                  }

                }
              } // switch

            }
            return node;
          }
        });
        if (svgAst1.children) {
          for (let i = 0; i < svgAst1.children.length; i++) {
            let child = svgAst1.children[i];
            if (child.name === "style" || child.name === "defs" && child.children && child.name === "defs" && child.children[0].name === "style") {
              svgAst1.children.splice(i, 1);
              break;
            }
          }
        }

        const outSVGstr = svgson.stringify(svgAst1);
        await writeFile(targetPath, outSVGstr);
      } catch (ex) {
        grunt.log.error(`processIconStates exception: ${ex}`);
        throw ex;
      }
    }
  }


  async function createClassMappingsExpanded(svgStr) {
    let ids = {};
    const svgAst1 = await svgson.parse(svgStr, {
      transformNode: function (node) {
        if (node.type === "element" && node.attributes && node.attributes.id) {
          const id = node.attributes.id;
          switch (id) {
          case 'state':
          case 'focus':
            addToClassMapping(node.attributes.class, id, ids);
            break;
          case 'metaphor':
            if (!addToClassMapping(node.attributes.class, 'metaphor0', ids)) {
              if (node.children) {
                for (let ci = 0; ci < node.children.length; ci++) {
                  let child = node.children[ci];
                  if (child.type === 'element' && child.attributes) {
                    addToClassMapping(child.attributes.class, id + ci, ids);
                  }
                }
              }
            }
            break;
          } // switch
        }
      } // transformNode
    });
    return ids;
  }

  async function processIconStates(parsedPath, src, dest, suffix, iconStates, ids, svgStr) {
    for (let j = 0; j < Object.keys(iconStates).length; j++) {
      try {
        let state = Object.keys(iconStates)[j];

        let stateSuffix = '';
        if (state !== 'normal') {
          stateSuffix = '~' + state;
        }

        let targetFilename = parsedPath.name + suffix + stateSuffix + parsedPath.ext;
        let targetPath = path.join(dest, targetFilename);
        grunt.log.debug(`target: ${targetPath}`);

        let regex = /\.(.*)\{(.*)\}/g;
        const svgAst1 = await svgson.parse(svgStr, {
          transformNode: function (node) {
            grunt.log.debug(`node: ${JSON.stringify(node)}`);

            if (node.type === "element" && node.attributes && node.attributes.id) {
              const id = node.attributes.id;
              switch (id) {
              case 'state':
              case 'focus':
                delete node.attributes.id;
                if (node.attributes.class) {
                  node.attributes.class = id;
                }
                break;
              case 'metaphor':
                delete node.attributes.id;
                if (node.attributes.class) {
                  node.attributes.class = id + '0'; // use metaphor0
                } else {
                  if (node.children) {
                    for (let ci = 0; ci < node.children.length; ci++) {
                      let child = node.children[ci];
                      if (child.type === 'element' && child.attributes &&
                          child.attributes.class) {
                        child.attributes.class = id + ci;
                      }
                    }
                  }
                }
                break;
              }
              return node;
            }

            if (node.type === "element" && node.name === "style") {
              let newChildren = [];
              for (let k = 0; node.children && k < node.children.length; k++) {
                let svgClasses = {};
                let child = node.children[k];
                let all = child.value;
                let matches;
                do {
                  matches = regex.exec(all);
                  if (matches && matches.length === 3) {
                    let selector = matches[1].trim();
                    svgClasses[selector] = parseStyles(matches[2]);
                  }
                } while (matches);
                let styleStr = '';
                const svgClassKeys = Object.keys(svgClasses);
                for (let l = 0; l < svgClassKeys.length; l++) {
                  let cssClass = svgClassKeys[l];
                  let replacedCssClasses = [cssClass];
                  if (ids[cssClass]) {
                    replacedCssClasses = ids[cssClass];
                  }
                  if (svgClasses[cssClass]) {
                    let iconState = iconStates[state];
                    grunt.log.debug(`iconStates[${state}]: ${JSON.stringify(iconState)}`);
                    grunt.log.debug(
                        `class ${cssClass} will be replaced by ${replacedCssClasses.join(',')}`);

                    for (let cd = 0; cd < replacedCssClasses.length; cd++) {
                      let cssClassDefinition = svgClasses[cssClass];
                      let replacedCssClass = replacedCssClasses[cd];
                      let stylesForState = iconState[replacedCssClass];
                      if (stylesForState) {
                        grunt.log.debug(
                            `styles for replaced class ${replacedCssClass}: ${JSON.stringify(
                                stylesForState)}`);

                        for (let c = 0; c < Object.keys(stylesForState).length; c++) {
                          let styleName = Object.keys(stylesForState)[c];
                          cssClassDefinition[styleName] = stylesForState[styleName];
                        }
                      } else {
                        grunt.log.debug(
                            `No styles defined for replaced class ${replacedCssClass}`);
                      }

                      styleStr += `\n\t.${replacedCssClass} {`;
                      const styles = Object.keys(cssClassDefinition);
                      for (let m = 0; m < styles.length; m++) {
                        let style = styles[m];
                        let styleValue = cssClassDefinition[style];
                        styleStr += `${style}:${styleValue};`;
                      }
                      styleStr += '}';

                    }
                  }

                }

                styleStr += '\n';
                child.value = styleStr;
                child.attributes = {type: "text/css"};
              }

              return node;
            }

            return node;
          }
        });

        const outSVGstr = svgson.stringify(svgAst1);
        await writeFile(targetPath, outSVGstr);
      } catch (ex) {
        grunt.log.error(`processIconStates exception: ${ex}`);
        throw ex;
      }
    }
  }


  async function processSVG(options, src, dest) {
    for (let i = 0; i < Object.keys(options).length; i++) {
      let mode = Object.keys(options)[i];
      let modeOptions = options[mode];
      let suffix = modeOptions.filenameSuffix;
      if (suffix) {
        suffix = '.' + suffix;
      }

      grunt.log.debug(`mode: ${mode}, src: ${src}`);
      let parsedPath = path.parse(src);

      if (modeOptions.includeOnly && _.isArray(modeOptions.includeOnly)) {
        if (!_.find(modeOptions.includeOnly, p => {
          grunt.log.debug(`check if ${src} contains ${p}`);
          return src.indexOf(p) >= 0;
        })) {
          grunt.log.debug(`Skipping ${src}, because it is not in includeOnly list`);
          continue;
        }
      }

      const modeIsInlineStyles = true;  // currently only this mode is used

      let styles, svgStr, classMapping;
      try {
        svgStr = await readFile(src);

        if (modeIsInlineStyles) {
          classMapping = await createClassMappings(svgStr);
          styles = await getStylesForClasses(svgStr);
        } else {
          styles = await createClassMappingsExpanded(svgStr);
        }

      } catch (ex) {
        grunt.log.error(`processSVG: readFile exception: ${ex}`);
        throw ex;
      }

      if (Object.keys(styles).length) {
        if (modeOptions.iconStates) {
          if (modeIsInlineStyles) {
            await convertClassesToInlineStyles(parsedPath, src, dest, suffix,
                modeOptions.iconStates, styles, classMapping, svgStr);
          } else {
            await processIconStates(parsedPath, src, dest, suffix, modeOptions.iconStates, styles,
                svgStr);
          }
        } else {
          grunt.log.warning(
              `Can't process icon, because iconStates are not defined for mode ${mode}`);
        }
      }

      grunt.log.debug("#############");
    }
  }


  function cleanupPreviouslyGeneratedFiles(srcFiles) {
    for (let j = 0; j < srcFiles.length; j++) {
      let oneFile = srcFiles[j];
      for (let k = 0; k < oneFile.src.length; k++) {
        let src = oneFile.src[k];
        let parsedSrc = path.parse(src);

        var children = fs.readdirSync(parsedSrc.dir, {withFileTypes: true});
        for (let f = 0; f < children.length; f++) {
          let dirent = children[f];
          if (!dirent.isFile()) {
            continue; // skip all but files
          }

          let nameWithoutExt = path.join(parsedSrc.dir, parsedSrc.name);
          let fileInDir = path.join(parsedSrc.dir, dirent.name);
          let parsedFileInDir = path.parse(fileInDir);
          if (fileInDir !== src && parsedFileInDir.ext === parsedSrc.ext) {
            if (fileInDir.startsWith(nameWithoutExt + '.') ||
                fileInDir.startsWith(nameWithoutExt + '~')) {
              fs.unlinkSync(fileInDir);
            }
          }
        }
      }
    }
  }
  async function exists(file) {
    try {
      return await stat(file);
    } catch (statEx) {
      if (statEx.code !== "ENOENT") {
        throw statEx;
      }
    }
  }

  grunt.registerMultiTask('generateSVGs', 'Takes SVG files from a list and generates versions' +
                                          ' of it with changed colors that can be used for a' +
                                          ' mode with a dark background like in high contrast' +
                                          ' mode', async function () {

    let done = this.async();
    const taskName = this.name;

    try {
      grunt.log.debug(`${taskName}, target ${this.target} has ${this.files.length} files blocks`);

      const options = this.data.options;
      grunt.log.debug(`options: ${JSON.stringify(options, undefined, 2)}`);

      for (let i = 0; i < this.files.length; i++) {
        let files = this.files[i];

        if (!_.isArray(files)) {
          files = [files];
        }
        for (let j = 0; j < files.length; j++) {
          let oneFileSet = files[j];
          let destDir = oneFileSet.dest;
          if (!destDir) {
            grunt.log.error(
                `${taskName}, target ${this.target}: destDir not defined for fileset`);
            done(false);  // fail grunt task asynchronously
            return;
          }

          const destStat = await exists(destDir);
          if (destStat) {
            if (!destStat.isDirectory()) {
              grunt.log.error(
                  `${taskName}, target ${this.target}: destDir (${destDir}) is not a directory`);
              done(false);  // fail grunt task asynchronously
              return;
            }

            var children = await readdir(destDir);
            if (children.length > 0) {
              grunt.log.error(
                  `${taskName}, target ${this.target}: destDir (${destDir}) is not empty`);
              done(false);  // fail grunt task asynchronously
              return;
            }
          } else {
            await mkdir(destDir);
          }

          if (!_.isArray(oneFileSet.src)) {
            oneFileSet.src = [oneFileSet.src];
          }
          if (oneFileSet.src.length) {
            for (let k = 0; k < oneFileSet.src.length; k++) {
              let src = oneFileSet.src[k];
              const srcStat = await stat(src);
              let srcFiles = [];
              if (srcStat.isDirectory()) {
                var filesInSrcDir = await readdir(src);
                for (let l = 0; l < filesInSrcDir.length; l++) {
                  var srcFile = filesInSrcDir[l];
                  let parsedSrcFile = path.parse(srcFile);
                  if (parsedSrcFile.ext === '.svg') {
                    srcFiles.push(path.join(src, srcFile));
                  }
                }
              } else {
                srcFiles.push(oneFileSet.src);
              }

              for (let l = 0; l < srcFiles.length; l++) {
                const srcFile = srcFiles[l];
                grunt.log.debug(`src ${srcFile}`);
                await processSVG(options, srcFile, destDir);
              }
            }
          }
        }
      }
      done();
    } catch (ex) {
      grunt.log.error(`${taskName}, target ${this.target} has thrown an exception: ${ex}`);
      grunt.log.error(`${ex.stack}`);
      done(false);  // fail grunt task asynchronously
    }
  });

  async function rmdirs(dir) {
    let entries = await readdir(dir);
    let results = await Promise.all(entries.map(async (entry) => {
      let fullPath = path.join(dir, entry);
      let stats = await stat(fullPath);
      let task = stats.isDirectory() ? rmdirs(fullPath) : unlink(fullPath);
      return task.catch(error => ({error}));
    }));
    results.forEach(result => {
      if (result && result.error.code !== 'ENOENT') {
        throw result.error;
      }
    });
    await rmdir(dir);
  }

  grunt.registerMultiTask('cleanupGeneratedSVGs', 'Deletes all generated SVG files',
      async function () {

        let done = this.async();
        const taskName = this.name;

        try {
          let directories = this.data;

          if (!_.isArray(directories)) {
            directories = [directories];
          }

          for (let i = 0; i < directories.length; i++) {
            const dir = directories[i];

            if (await exists(dir)) {
              grunt.log.debug(`Deleting ${dir}...`);
              await rmdirs(dir);
            } else {
              grunt.log.debug(`Skip deleting ${dir}, because it does not exist`);
            }
          }
          grunt.log.debug(`Finished ${taskName}...`);

          done();
        } catch (ex) {
          grunt.log.error(`${taskName}, target ${this.target} has thrown an exception: ${ex}`);
          grunt.log.error(`${ex.stack}`);
          done(false);  // fail grunt task asynchronously
        }
      });
};
