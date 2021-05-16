/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/jquery', 'csui/lib/underscore',
  'conws/utils/test/testutil', 'csui/utils/log'
], function ($, _,
    TestUtil, log
) {

  function log_call(context,text) {
    if (!context.logs) {
      context.logs = [];
    }
    context.logs.push(text);
    log.info(text) && console.log(log.last);
  }

  describe('Jasmine 2 run and wait test', function () {

    it('run-a (run and wait)', function (done) {

      var context = {};

      TestUtil.run(done,function(done) {
        log_call(context,"run-a 1.1");
        TestUtil.justWait(done,"run-a 1.2",1000);
        TestUtil.run(done,function(){log_call(context,"run-a 1.2");});
      });

      TestUtil.run(done,function() {
        log_call(context,"run-a 1.3");
      });

      TestUtil.run(done,function(done) {
        log_call(context,"run-a 2.1");
        TestUtil.run(done,function(done) {
          log_call(context,"run-a 2.1.1");
          TestUtil.run(done,function(){log_call(context,"run-a 2.1.2");});
          log_call(context,"run-a 2.1.3 :-(");
          TestUtil.run(done,function(){log_call(context,"run-a 2.1.4");});
        });
        TestUtil.run(done,function(){log_call(context,"run-a 2.2");});
      });

      TestUtil.run(done,function() {
        log_call(context,"run-a 2.9");
      });

      TestUtil.run(done,function(done) {
        TestUtil.run(done,function(){log_call(context,"run-a 3.1");});
        TestUtil.justWait(done,"run-a 3.2",1000);
        log_call(context,"run-a 3.2 :-(");
      });

      TestUtil.run(done,function() {
        expect(context.logs).toEqual([
          "run-a 1.1","run-a 1.2","run-a 1.3",
          "run-a 2.1","run-a 2.1.1","run-a 2.1.3 :-(","run-a 2.1.2","run-a 2.1.4","run-a 2.2","run-a 2.9",
          "run-a 3.2 :-(","run-a 3.1"
        ]);
      });
    });

    it('run-b (run wait run)', function(done) {

      var context = {};

      var condition = null;

      log_call(context,"run-b 1.1");

      TestUtil.run(done,function(){
        log_call(context,"run-b 1.2");
        setTimeout(function(){
          condition = true;
        },1000)
      });

      TestUtil.waitFor(done,function(){
        if (condition===null) {
          condition = false;
          log_call(context,"run-b 2.1");
        } else if (condition) {
          log_call(context,"run-b 2.2");
        }
        return condition;
      },"condition to become true",1100);

      TestUtil.run(done,function(){
        log_call(context,"run-b 3.1");
      });

      log_call(context,"run-b 1.3 :-(");

      TestUtil.run(done,function() {
        expect(context.logs).toEqual([
          "run-b 1.1","run-b 1.3 :-(","run-b 1.2",
          "run-b 2.1","run-b 2.2","run-b 3.1"
        ]);
      });
    });

    it("run-c (run only)", function(done) {

      var context = {};

      log_call(context,"run-c 1");

      TestUtil.run(done,function(){log_call(context,"run-c 2");});

      log_call(context,"run-c 3 :-(");

      TestUtil.run(done,function() {
        expect(context.logs).toEqual(["run-c 1","run-c 3 :-(","run-c 2"]);
      });
    });

  });

  describe("Jasmine 2 timeout test", function() {

    it("run-d (long timeout)", function(done) {

      TestUtil.justWait(done,"run-d 1",6000);

    },6100); // in Jasmine2 you can pass the timeout for the test as 3rd paramter in ms. default is 5000ms.

  });

});
