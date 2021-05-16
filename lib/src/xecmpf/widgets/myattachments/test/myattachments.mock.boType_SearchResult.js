/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore'
], function (_) {

    var boType_SearchResult =
        {
            "links": {
                "data": {
                    "self": {
                        "body": "",
                        "content_type": "",
                        "href": "\/api\/v2\/businessobjects?bo_type_id=3&limit=100&page=1",
                        "method": "GET",
                        "name": ""
                    }
                }
            },
            "paging": {
                "actions": {
                    "next": {
                        "body": "",
                        "content_type": "",
                        "href": "\/api\/v2\/businessobjects?bo_type_id=3&limit=100&page=2",
                        "method": "GET",
                        "name": ""
                    }
                }, "limit": 100, "page": 1, "page_total": 2, "range_max": 100, "range_min": 1, "total_count": 101
            },
            "results": {
                "column_descriptions": [{
                    "fieldLabel": "Cty",
                    "fieldName": "LAND1",
                    "keyField": "",
                    "length": 3,
                    "position": 1
                }, {
                    "fieldLabel": "SearchTerm",
                    "fieldName": "SORTL",
                    "keyField": "",
                    "length": 10,
                    "position": 2
                }, {
                    "fieldLabel": "Name 1",
                    "fieldName": "MCOD1",
                    "keyField": "",
                    "length": 25,
                    "position": 3
                }, {
                    "fieldLabel": "City",
                    "fieldName": "MCOD3",
                    "keyField": "",
                    "length": 25,
                    "position": 4
                }, {"fieldLabel": "Vendor", "fieldName": "LIFNR", "keyField": "X", "length": 10, "position": 5}],
                "max_rows_exceeded": false,
                "result_rows": [{
                    "businessObjectId": "0000000001",
                    "City": "HAMBURG",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "FORKS MANUFACTURING GMBH",
                    "rowId": 1,
                    "SearchTerm": "CPG",
                    "Vendor": "1"
                }, {
                    "businessObjectId": "0000000002",
                    "City": "FOSTER CITY",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "ELECTRONIC COMPONENTS DIS",
                    "rowId": 2,
                    "SearchTerm": "ELECTRO",
                    "Vendor": "2"
                }, {
                    "businessObjectId": "0000000005",
                    "City": "NEW YORK",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "SAFETY CLEAN INC.",
                    "rowId": 3,
                    "SearchTerm": "SAFETY CLE",
                    "Vendor": "5"
                }, {
                    "businessObjectId": "0000000008",
                    "City": "MEXICO CITY",
                    "Cty": "MX",
                    "has_workspace": false,
                    "Name 1": "JOSE FERNANDEZ",
                    "rowId": 4,
                    "SearchTerm": "DERPFI",
                    "Vendor": "8"
                }, {
                    "businessObjectId": "0000000010",
                    "City": "PARIS",
                    "Cty": "FR",
                    "has_workspace": false,
                    "Name 1": "DUPONT DE LA RIVI\u00c8RE",
                    "rowId": 5,
                    "SearchTerm": "DUPONT",
                    "Vendor": "10"
                }, {
                    "businessObjectId": "0000000015",
                    "City": "BERLIN",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "TIEDEMEIER ENTSORGUNG GMB",
                    "rowId": 6,
                    "SearchTerm": "TIEDEMEIER",
                    "Vendor": "15"
                }, {
                    "businessObjectId": "0000000025",
                    "City": "COPENHAGEN",
                    "Cty": "DK",
                    "has_workspace": false,
                    "Name 1": "METROPOL",
                    "rowId": 7,
                    "SearchTerm": "DERPFI",
                    "Vendor": "25"
                }, {
                    "businessObjectId": "0000000050",
                    "City": "NEW YORK",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "CENTRAL LOGISTICS INC.",
                    "rowId": 8,
                    "SearchTerm": "CENTRAL LO",
                    "Vendor": "50"
                }, {
                    "businessObjectId": "0000000075",
                    "City": "BERLIN",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "MEIER LOGISTICS GMBH",
                    "rowId": 9,
                    "SearchTerm": "MEIER L",
                    "Vendor": "75"
                }, {
                    "businessObjectId": "0000000100",
                    "City": "BERLIN",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "C.E.B. BERLIN",
                    "rowId": 10,
                    "SearchTerm": "ALLGEMEIN",
                    "Vendor": "100"
                }, {
                    "businessObjectId": "0000000111",
                    "City": "FRANKENTHAL\/PFALZ",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "KBB SCHWARZE PUMPE",
                    "rowId": 11,
                    "SearchTerm": "PUME",
                    "Vendor": "111"
                }, {
                    "businessObjectId": "0000000200",
                    "City": "ATLANTA",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "SMP",
                    "rowId": 12,
                    "SearchTerm": "AUTO",
                    "Vendor": "200"
                }, {
                    "businessObjectId": "0000000222",
                    "City": "CHICAGO",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "EXPRESS VENDOR INC",
                    "rowId": 13,
                    "SearchTerm": "LES",
                    "Vendor": "222"
                }, {
                    "businessObjectId": "0000000300",
                    "City": "HILLSBOROUGH",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "ALUCAST",
                    "rowId": 14,
                    "SearchTerm": "AUTO",
                    "Vendor": "300"
                }, {
                    "businessObjectId": "0000000424",
                    "City": "RIMROCK",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "SEDONA SUPPLIERS",
                    "rowId": 15,
                    "SearchTerm": "SEDONA",
                    "Vendor": "424"
                }, {
                    "businessObjectId": "0000000500",
                    "City": "BERLIN",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "IDES AG NEW GL - (INTERCO",
                    "rowId": 16,
                    "SearchTerm": "IDES",
                    "Vendor": "500"
                }, {
                    "businessObjectId": "0000000603",
                    "City": "",
                    "Cty": "CA",
                    "has_workspace": false,
                    "Name 1": "INTERCOMPANY RESOURCES US",
                    "rowId": 17,
                    "SearchTerm": "SERVICE PR",
                    "Vendor": "603"
                }, {
                    "businessObjectId": "0000000604",
                    "City": "",
                    "Cty": "CA",
                    "has_workspace": false,
                    "Name 1": "INTERCOMPANY RESOURCES TO",
                    "rowId": 18,
                    "SearchTerm": "SERVICE PR",
                    "Vendor": "604"
                }, {
                    "businessObjectId": "0000000605",
                    "City": "",
                    "Cty": "CA",
                    "has_workspace": false,
                    "Name 1": "INTERCOMPANY RESOURCES CA",
                    "rowId": 19,
                    "SearchTerm": "SERVICE PR",
                    "Vendor": "605"
                }, {
                    "businessObjectId": "0000000935",
                    "City": "TULIA",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "BURTON\u0027S MACHINE SHOP",
                    "rowId": 20,
                    "SearchTerm": "JTE",
                    "Vendor": "935"
                }, {
                    "businessObjectId": "0000000954",
                    "City": "ATLANTA",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "ANDER GROUP",
                    "rowId": 21,
                    "SearchTerm": "MG",
                    "Vendor": "954"
                }, {
                    "businessObjectId": "0000001000",
                    "City": "BERLIN",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "C.E.B. BERLIN",
                    "rowId": 22,
                    "SearchTerm": "ALLGEMEIN",
                    "Vendor": "1000"
                }, {
                    "businessObjectId": "0000001001",
                    "City": "SCHWEINFURT",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "SKF KUGELMEIER KGAA",
                    "rowId": 23,
                    "SearchTerm": "AUTO\/PUMPE",
                    "Vendor": "1001"
                }, {
                    "businessObjectId": "0000001002",
                    "City": "ROSENHEIM",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "M\u00dcLLER KG",
                    "rowId": 24,
                    "SearchTerm": "AUFZ\u00dcGE",
                    "Vendor": "1002"
                }, {
                    "businessObjectId": "0000001003",
                    "City": "HARBOR CITY",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "GUSSWERK US",
                    "rowId": 25,
                    "SearchTerm": "AUTO",
                    "Vendor": "1003"
                }, {
                    "businessObjectId": "0000001004",
                    "City": "W1 LONDOND",
                    "Cty": "GB",
                    "has_workspace": false,
                    "Name 1": "JONES LTD.",
                    "rowId": 26,
                    "SearchTerm": "AUTO",
                    "Vendor": "1004"
                }, {
                    "businessObjectId": "0000001005",
                    "City": "MANHEIM",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "PAQ DEUTSCHLAND GMBH",
                    "rowId": 27,
                    "SearchTerm": "ELEKTO",
                    "Vendor": "1005"
                }, {
                    "businessObjectId": "0000001006",
                    "City": "FRANKFURT\/MAIN",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "BLACKS AG",
                    "rowId": 28,
                    "SearchTerm": "CHEMIE",
                    "Vendor": "1006"
                }, {
                    "businessObjectId": "0000001007",
                    "City": "HANNOVER",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "BIKE RETAIL & CO.",
                    "rowId": 29,
                    "SearchTerm": "BIKE",
                    "Vendor": "1007"
                }, {
                    "businessObjectId": "0000001008",
                    "City": "LEEDS",
                    "Cty": "GB",
                    "has_workspace": false,
                    "Name 1": "MOTOR CONSTRUCTIONS LTD.",
                    "rowId": 30,
                    "SearchTerm": "AUTO",
                    "Vendor": "1008"
                }, {
                    "businessObjectId": "0000001009",
                    "City": "ZUFFENHAUSEN",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "PARTS & PIPES",
                    "rowId": 31,
                    "SearchTerm": "MM-PUR",
                    "Vendor": "1009"
                }, {
                    "businessObjectId": "0000001010",
                    "City": "STUTTGART",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "SUNNY ELECTRONICS GMBH",
                    "rowId": 32,
                    "SearchTerm": "ELEKTRO",
                    "Vendor": "1010"
                }, {
                    "businessObjectId": "0000001011",
                    "City": "NEWARK",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "SKF AMERICAS",
                    "rowId": 33,
                    "SearchTerm": "AUTO\/PUMPE",
                    "Vendor": "1011"
                }, {
                    "businessObjectId": "0000001012",
                    "City": "BRAUNSCHWEIG",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "REIHL & M\u00dcLLER",
                    "rowId": 34,
                    "SearchTerm": "CHEMIE",
                    "Vendor": "1012"
                }, {
                    "businessObjectId": "0000001013",
                    "City": "HAMBURG",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "REAL ESTATE AGENCY HAMBUR",
                    "rowId": 35,
                    "SearchTerm": "IMMOBILIEN",
                    "Vendor": "1013"
                }, {
                    "businessObjectId": "0000001014",
                    "City": "HOLZMINDEN",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "HERRMANN & RIEMER",
                    "rowId": 36,
                    "SearchTerm": "CHEMIE",
                    "Vendor": "1014"
                }, {
                    "businessObjectId": "0000001015",
                    "City": "AACHEN",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "WOLLNER AG",
                    "rowId": 37,
                    "SearchTerm": "ELEKTRO",
                    "Vendor": "1015"
                }, {
                    "businessObjectId": "0000001020",
                    "City": "MANHEIM",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "GROSSHANDEL-BADEN USA",
                    "rowId": 38,
                    "SearchTerm": "ELEKTRO",
                    "Vendor": "1020"
                }, {
                    "businessObjectId": "0000001021",
                    "City": "FREIBURG",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "NOE\u00b4TECH COMPANY AG",
                    "rowId": 39,
                    "SearchTerm": "ELEKTRO",
                    "Vendor": "1021"
                }, {
                    "businessObjectId": "0000001022",
                    "City": "HAMBURG",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "MAX\u00b4GROSSHANDEL",
                    "rowId": 40,
                    "SearchTerm": "FOOD",
                    "Vendor": "1022"
                }, {
                    "businessObjectId": "0000001023",
                    "City": "POSTDAM",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "MOLKEREIGENOSSENSCHAFT BR",
                    "rowId": 41,
                    "SearchTerm": "MOLKEREI",
                    "Vendor": "1023"
                }, {
                    "businessObjectId": "0000001025",
                    "City": "BOULOGNE",
                    "Cty": "FR",
                    "has_workspace": false,
                    "Name 1": "SEC SYSTEM SA",
                    "rowId": 42,
                    "SearchTerm": "ELEKTRO",
                    "Vendor": "1025"
                }, {
                    "businessObjectId": "0000001030",
                    "City": "ATLANTA",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "JOTACHI DEUTSCHLAND AG",
                    "rowId": 43,
                    "SearchTerm": "ELEKTRO",
                    "Vendor": "1030"
                }, {
                    "businessObjectId": "0000001032",
                    "City": "MANCHESTER",
                    "Cty": "GB",
                    "has_workspace": false,
                    "Name 1": "WESSON LTD.",
                    "rowId": 44,
                    "SearchTerm": "CHEMIE",
                    "Vendor": "1032"
                }, {
                    "businessObjectId": "0000001033",
                    "City": "WALLDORF",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "WALLDORF GROSSHANDEL",
                    "rowId": 45,
                    "SearchTerm": "LAMPEN",
                    "Vendor": "1033"
                }, {
                    "businessObjectId": "0000001035",
                    "City": "DESSAU",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "SOMMER GMBH",
                    "rowId": 46,
                    "SearchTerm": "ELEKTRO",
                    "Vendor": "1035"
                }, {
                    "businessObjectId": "0000001040",
                    "City": "DUIBURG",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "HAMBERGER U. CO.",
                    "rowId": 47,
                    "SearchTerm": "ELEKTRO",
                    "Vendor": "1040"
                }, {
                    "businessObjectId": "0000001045",
                    "City": "LEIPZIG",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "KREUTZSCHMID KGAA",
                    "rowId": 48,
                    "SearchTerm": "ELEKTRO",
                    "Vendor": "1045"
                }, {
                    "businessObjectId": "0000001050",
                    "City": "ROSENHEIM",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "HUMPERT U. T\u00d6CHTER GMBH",
                    "rowId": 49,
                    "SearchTerm": "ELEKTRO",
                    "Vendor": "1050"
                }, {
                    "businessObjectId": "0000001055",
                    "City": "ROTTERDAM",
                    "Cty": "NL",
                    "has_workspace": false,
                    "Name 1": "INTER-SPEED BV",
                    "rowId": 50,
                    "SearchTerm": "SPEDITION",
                    "Vendor": "1055"
                }, {
                    "businessObjectId": "0000001058",
                    "City": "HAMBURG",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "NORDSPEED GMBH",
                    "rowId": 51,
                    "SearchTerm": "SPEDITION",
                    "Vendor": "1058"
                }, {
                    "businessObjectId": "0000001059",
                    "City": "DENVER",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "EXPRESS SHIP CARRIER",
                    "rowId": 52,
                    "SearchTerm": "UPS",
                    "Vendor": "1059"
                }, {
                    "businessObjectId": "0000001060",
                    "City": "HALLE",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "CHEMISCHE WERKE HALLE",
                    "rowId": 53,
                    "SearchTerm": "CHEMIE",
                    "Vendor": "1060"
                }, {
                    "businessObjectId": "0000001061",
                    "City": "WEILERBACH",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "NEOTECH GMBH",
                    "rowId": 54,
                    "SearchTerm": "PARTNERROL",
                    "Vendor": "1061"
                }, {
                    "businessObjectId": "0000001065",
                    "City": "REGENSBURG",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "PAPIERWERKE BAYLAND AG",
                    "rowId": 55,
                    "SearchTerm": "VERPACKUNG",
                    "Vendor": "1065"
                }, {
                    "businessObjectId": "0000001070",
                    "City": "K\u00d6LN",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "POLY AG",
                    "rowId": 56,
                    "SearchTerm": "CHEMIE",
                    "Vendor": "1070"
                }, {
                    "businessObjectId": "0000001075",
                    "City": "LEIPZIG",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "TIEFLAND GLASS AG",
                    "rowId": 57,
                    "SearchTerm": "BELEUCHT",
                    "Vendor": "1075"
                }, {
                    "businessObjectId": "0000001080",
                    "City": "MARSEILLES",
                    "Cty": "FR",
                    "has_workspace": false,
                    "Name 1": "G\u00c9N\u00c9RALE ELECTRONIQUE SA",
                    "rowId": 58,
                    "SearchTerm": "SCHULUNG",
                    "Vendor": "1080"
                }, {
                    "businessObjectId": "0000001081",
                    "City": "MILWAUKEE",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "HARLEY-DAVIDSON MOTORCYCL",
                    "rowId": 59,
                    "SearchTerm": "BIKE",
                    "Vendor": "1081"
                }, {
                    "businessObjectId": "0000001082",
                    "City": "HAMBURG",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "LOUIS BIKE PARTS",
                    "rowId": 60,
                    "SearchTerm": "BIKE",
                    "Vendor": "1082"
                }, {
                    "businessObjectId": "0000001090",
                    "City": "SAN LUIS REY",
                    "Cty": "MX",
                    "has_workspace": false,
                    "Name 1": "SANCHEZ S.A.",
                    "rowId": 61,
                    "SearchTerm": "MEXICO",
                    "Vendor": "1090"
                }, {
                    "businessObjectId": "0000001095",
                    "City": "MEXICO-CITY",
                    "Cty": "MX",
                    "has_workspace": false,
                    "Name 1": "LOPEZ S.A.",
                    "rowId": 62,
                    "SearchTerm": "MEXICO LO",
                    "Vendor": "1095"
                }, {
                    "businessObjectId": "0000001096",
                    "City": "MEXICO, D.F.",
                    "Cty": "MX",
                    "has_workspace": false,
                    "Name 1": "FABRICAS MIXTLI S.A.",
                    "rowId": 63,
                    "SearchTerm": "LABEL",
                    "Vendor": "1096"
                }, {
                    "businessObjectId": "0000001097",
                    "City": "",
                    "Cty": "MX",
                    "has_workspace": false,
                    "Name 1": "PUEBLA DIGITAL S.A.",
                    "rowId": 64,
                    "SearchTerm": "CD",
                    "Vendor": "1097"
                }, {
                    "businessObjectId": "0000001098",
                    "City": "BUENOS AIRES",
                    "Cty": "AR",
                    "has_workspace": false,
                    "Name 1": "PRODUCTOS ARGENTINOS IMP.",
                    "rowId": 65,
                    "SearchTerm": "CD",
                    "Vendor": "1098"
                }, {
                    "businessObjectId": "0000001099",
                    "City": "",
                    "Cty": "GB",
                    "has_workspace": false,
                    "Name 1": "STUDIO CHAPULTEPEC",
                    "rowId": 66,
                    "SearchTerm": "CD",
                    "Vendor": "1099"
                }, {
                    "businessObjectId": "0000001100",
                    "City": "FRANKFURT",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "PHUNIX GMBH",
                    "rowId": 67,
                    "SearchTerm": "FI-PHUNIX",
                    "Vendor": "1100"
                }, {
                    "businessObjectId": "0000001101",
                    "City": "MANNHEIM",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "ABC DIENSTLEISTUNGS GMBH",
                    "rowId": 68,
                    "SearchTerm": "SRV",
                    "Vendor": "1101"
                }, {
                    "businessObjectId": "0000001102",
                    "City": "KAISERSLAUTERN",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "TOP SERVICES GMBH",
                    "rowId": 69,
                    "SearchTerm": "SRV",
                    "Vendor": "1102"
                }, {
                    "businessObjectId": "0000001103",
                    "City": "M\u00dcNCHEN",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "ISG INNOVATIVE SERVICES G",
                    "rowId": 70,
                    "SearchTerm": "SRV",
                    "Vendor": "1103"
                }, {
                    "businessObjectId": "0000001104",
                    "City": "KAISERLAUTERN",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "HOCH UND TIEFBAU GMBH KAI",
                    "rowId": 71,
                    "SearchTerm": "SRV",
                    "Vendor": "1104"
                }, {
                    "businessObjectId": "0000001105",
                    "City": "NEWCASTLE",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "HARVEY BUILDING AND CONST",
                    "rowId": 72,
                    "SearchTerm": "SRV",
                    "Vendor": "1105"
                }, {
                    "businessObjectId": "0000001106",
                    "City": "ENKENBACH",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "SPEDITRANS TRANSPORT GMBH",
                    "rowId": 73,
                    "SearchTerm": "SRV",
                    "Vendor": "1106"
                }, {
                    "businessObjectId": "0000001110",
                    "City": "CHICAGO",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "ILLINOIS UTILITIES",
                    "rowId": 74,
                    "SearchTerm": "CMR",
                    "Vendor": "1110"
                }, {
                    "businessObjectId": "0000001111",
                    "City": "NILES",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "SUPPLIERS INC.",
                    "rowId": 75,
                    "SearchTerm": "AUTO\/PUMPE",
                    "Vendor": "1111"
                }, {
                    "businessObjectId": "0000001120",
                    "City": "MANNHEIM",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "ROHRBAU-DIENSTLEISTUNGS G",
                    "rowId": 76,
                    "SearchTerm": "SRV",
                    "Vendor": "1120"
                }, {
                    "businessObjectId": "0000001121",
                    "City": "FREIBURG",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "WAGNER SPENGLEREI & ROHRB",
                    "rowId": 77,
                    "SearchTerm": "SRV",
                    "Vendor": "1121"
                }, {
                    "businessObjectId": "0000001150",
                    "City": "OSNABR\u00dcCK",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "P + S TECHNIK",
                    "rowId": 78,
                    "SearchTerm": "KAMERA",
                    "Vendor": "1150"
                }, {
                    "businessObjectId": "0000001151",
                    "City": "TRIER",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "MEDIA AG TRIER",
                    "rowId": 79,
                    "SearchTerm": "KAMERA",
                    "Vendor": "1151"
                }, {
                    "businessObjectId": "0000001152",
                    "City": "BONN",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "CAMELOT",
                    "rowId": 80,
                    "SearchTerm": "KAMERA",
                    "Vendor": "1152"
                }, {
                    "businessObjectId": "0000001200",
                    "City": "FRANKFURT",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "FINANZAMT FRANKFURT",
                    "rowId": 81,
                    "SearchTerm": "FI-FINANZ",
                    "Vendor": "1200"
                }, {
                    "businessObjectId": "0000001222",
                    "City": "CHICAGO",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "ABC SUPPLY COMPANY",
                    "rowId": 82,
                    "SearchTerm": "CMR",
                    "Vendor": "1222"
                }, {
                    "businessObjectId": "0000001234",
                    "City": "BERLIN",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "K.F.W. BERLIN",
                    "rowId": 83,
                    "SearchTerm": "MECH",
                    "Vendor": "1234"
                }, {
                    "businessObjectId": "0000001235",
                    "City": "LONDON",
                    "Cty": "GB",
                    "has_workspace": false,
                    "Name 1": "K.F.W. LONDON",
                    "rowId": 84,
                    "SearchTerm": "MECH",
                    "Vendor": "1235"
                }, {
                    "businessObjectId": "0000001333",
                    "City": "CHICAGO",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "SUB CONTRACT & SUPPLY",
                    "rowId": 85,
                    "SearchTerm": "CMR",
                    "Vendor": "1333"
                }, {
                    "businessObjectId": "0000001444",
                    "City": "CLEVELAND",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "C & C SUPPLY",
                    "rowId": 86,
                    "SearchTerm": "CMR",
                    "Vendor": "1444"
                }, {
                    "businessObjectId": "0000001472",
                    "City": "FORT LAUDERDALE",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "MG TRUCKING",
                    "rowId": 87,
                    "SearchTerm": "MG",
                    "Vendor": "1472"
                }, {
                    "businessObjectId": "0000001500",
                    "City": "PHILADELPHIA",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "EASTERN SUPPLY CO.",
                    "rowId": 88,
                    "SearchTerm": "EASTERN",
                    "Vendor": "1500"
                }, {
                    "businessObjectId": "0000001550",
                    "City": "FRANKFURT",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "STADTWERKE FRANKFURT",
                    "rowId": 89,
                    "SearchTerm": "FI-STADTW",
                    "Vendor": "1550"
                }, {
                    "businessObjectId": "0000001560",
                    "City": "CHICAGO",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "METAL CONTAINER INC.",
                    "rowId": 90,
                    "SearchTerm": "FI-AUSLAND",
                    "Vendor": "1560"
                }, {
                    "businessObjectId": "0000001570",
                    "City": "FRANKFURT",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "LENZMANN IMMOBILIEN VERWA",
                    "rowId": 91,
                    "SearchTerm": "FI-MIETE",
                    "Vendor": "1570"
                }, {
                    "businessObjectId": "0000001700",
                    "City": "PHILADELPHIA",
                    "Cty": "PA",
                    "has_workspace": false,
                    "Name 1": "REAL ESTATE COMPANY USA",
                    "rowId": 92,
                    "SearchTerm": "REAL",
                    "Vendor": "1700"
                }, {
                    "businessObjectId": "0000001703",
                    "City": "ROUND ROCK",
                    "Cty": "US",
                    "has_workspace": false,
                    "Name 1": "DELL COMPUTERS",
                    "rowId": 93,
                    "SearchTerm": "DELL",
                    "Vendor": "1703"
                }, {
                    "businessObjectId": "0000001910",
                    "City": "K\u00d6LN",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "SCHUMACHER AG",
                    "rowId": 94,
                    "SearchTerm": "TRADE",
                    "Vendor": "1910"
                }, {
                    "businessObjectId": "0000001920",
                    "City": "FRANKFURT",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "VERSICHERUNGEN ABC",
                    "rowId": 95,
                    "SearchTerm": "FI-VERSICH",
                    "Vendor": "1920"
                }, {
                    "businessObjectId": "0000001921",
                    "City": "M\u00dcNCHEN",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "GLOBAL INSURANCES",
                    "rowId": 96,
                    "SearchTerm": "INSURANCE",
                    "Vendor": "1921"
                }, {
                    "businessObjectId": "0000001925",
                    "City": "STUTTGART",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "TRANSLOG GMBH",
                    "rowId": 97,
                    "SearchTerm": "SPEDITION",
                    "Vendor": "1925"
                }, {
                    "businessObjectId": "0000001930",
                    "City": "FRANKFURT",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "SCHMALENBACH",
                    "rowId": 98,
                    "SearchTerm": "SPEDITION",
                    "Vendor": "1930"
                }, {
                    "businessObjectId": "0000001935",
                    "City": "DRESDEN",
                    "Cty": "DE",
                    "has_workspace": false,
                    "Name 1": "SLL CARGO SERVICES",
                    "rowId": 99,
                    "SearchTerm": "SPEDITION",
                    "Vendor": "1935"
                }, {
                    "businessObjectId": "0000001940",
                    "City": "LONDON TW3 LN2",
                    "Cty": "GB",
                    "has_workspace": false,
                    "Name 1": "BRAIN ASSOCIATES",
                    "rowId": 100,
                    "SearchTerm": "BRAIN ASSO",
                    "Vendor": "1940"
                }]
            }
        }
        ;


    return boType_SearchResult;

});
