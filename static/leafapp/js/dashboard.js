$(function() {

    var chart_format        = '%_I:%M:%S %p';
    var backup_chart_format = '%_I:%M:%S %p';
    var total_chart_format  = '%_I:%M:%S %p';

    var chart = {};
    var backup_chart = {};
    var total_chart = {};

    var utc = (parseInt(-(new Date()).getTimezoneOffset()) / 60) * 100;
    if (Math.abs(utc) >= 1000)
        utc = '+' + utc.toString();
    else
        utc = (utc > 0) ? ('+0' + utc.toString()) : ('-0' + Math.abs(utc).toString());


    /*
        Datepicker
    */
    $('#date').Zebra_DatePicker({
        format: 'm-d-Y',
        direction: false,
        onSelect: function (view, elements) {
            $.get('/get_temperature_reading', { 'mode': $('#mode').find(':selected').val(), 'datepicker': $('#date').val(), 'timezone': utc }, function(data) {
            console.log("working temperature");
            try {
                chart.destroy();
            }
            catch (ex) {
                // Ignored
            }


            chart = c3.generate({

                bindto: '#graph',

                data: {
                    x: 'timestamp',
                    type: 'line',
                    columns: [
                        ['timestamp', ],
                        ['temperature', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                },
                zoom: {
                    enabled: true
                },
                point: {
                    show: true,
                },
                axis: {
                    x: {
                        tick: {
                            format: function (d) {
                                return d3.time.format(chart_format)(new Date(d));
                            },
                        },
                    },
                    y: {
                        tick: {
                            format: function (p) {
                                return parseFloat(p).toFixed(2) + ' C';
                            },
                        },
                    },
                },
            });
            $('#graph-date-label').html( $('#date').val() );

            let timestamp_reading = ['timestamp'];
            for (let n=0; n < data.timestamp.length; n++)
                timestamp_reading.push( new Date(data.timestamp[n]) );

            let temperature   = ['temperature'].concat(data.temperature);

            chart.load({
                columns: [timestamp_reading, temperature]
            });

        });

        }
    });
    $('#arabica-date').Zebra_DatePicker({
        format: 'm-d-Y',
        direction: false,
        onSelect: function (view, elements) {
            $.get('/arabica_variety',{ 'mode': $('#arabica-mode').find(':selected').val(), 'datepicker': $('#arabica-date').val(), 'timezone': utc }, function(data) {
            console.log("working arabica all");
            try {
                chart2.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart2 = c3.generate({
                bindto: '#arabica-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#arabica-date-label').html( $('#arabica-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
            console.log(obj["deficiency"]);
             chart2.load({
               columns: [obj["deficiency1"], obj["deficiency2"]]
            });
            var x = document.getElementById("total_aphos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("total_apot_table");
            x.innerHTML = obj["deficiency2"][1];
        });
        }
    });
    $('#robusta-date').Zebra_DatePicker({
        format: 'm-d-Y',
        direction: false,
        onSelect: function (view, elements) {
            $.get('/robusta_variety',{ 'mode': $('#robusta-mode').find(':selected').val(), 'datepicker': $('#robusta-date').val(), 'timezone': utc }, function(data) {
            console.log("working robusta all");
            try {
                chart3.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart3 = c3.generate({
                bindto: '#robusta-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#robusta-date-label').html( $('#robusta-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
            console.log(obj["deficiency"]);
             chart3.load({
               columns: [obj["deficiency1"], obj["deficiency2"],obj["deficiency3"],obj["deficiency4"],
               obj["deficiency5"],obj["deficiency6"],obj["deficiency7"],obj["deficiency8"],]
            });
            var x = document.getElementById("total_rphos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("total_rpot_table");
            x.innerHTML = obj["deficiency2"][1];
            var x = document.getElementById("total_rcal_table");
            x.innerHTML = obj["deficiency3"][1];
            var x = document.getElementById("total_rbo_table");
            x.innerHTML = obj["deficiency4"][1];
            var x = document.getElementById("total_rir_table");
            x.innerHTML = obj["deficiency5"][1];
            var x = document.getElementById("total_rmag_table");
            x.innerHTML = obj["deficiency6"][1];
            var x = document.getElementById("total_rnit_table");
            x.innerHTML = obj["deficiency7"][1];
            var x = document.getElementById("total_rzinc_table");
            x.innerHTML = obj["deficiency8"][1];

        });

        }
    });
    $('#liberica-date').Zebra_DatePicker({
        format: 'm-d-Y',
        direction: false,
        onSelect: function (view, elements) {
            $.get('/liberica_variety',{ 'mode': $('#liberica-mode').find(':selected').val(), 'datepicker': $('#liberica-date').val(), 'timezone': utc }, function(data) {
            console.log("working liberica all");
            try {
                chart4.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart4 = c3.generate({
                bindto: '#liberica-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#liberica-date-label').html( $('#liberica-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
             chart4.load({
               columns: [obj["deficiency1"], obj["deficiency2"]]
            });
            var x = document.getElementById("total_lphos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("total_lnit_table");
            x.innerHTML = obj["deficiency2"][1];
        });

        }
    });
    $('#excela-date').Zebra_DatePicker({
        format: 'm-d-Y',
        direction: false,
        onSelect: function (view, elements) {
            $.get('/excela_variety',{ 'mode': $('#excela-mode').find(':selected').val(), 'datepicker': $('#excela-date').val(), 'timezone': utc }, function(data) {
            console.log("working excela all");
            try {
                chart5.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart5 = c3.generate({
                bindto: '#excela-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#excela-date-label').html( $('#excela-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
             chart5.load({
               columns: [obj["deficiency1"], obj["deficiency2"], obj["deficiency3"]]
            });
            var x = document.getElementById("total_ephos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("total_epot_table");
            x.innerHTML = obj["deficiency2"][1];
            var x = document.getElementById("total_ecal_table");
            x.innerHTML = obj["deficiency3"][1];
        });

        }
    });
    $('#amadeoarabica-date').Zebra_DatePicker({
        format: 'm-d-Y',
        direction: false,
        onSelect: function (view, elements) {
            $.get('/amadeo_arabica_variety',{ 'mode': $('#amadeoarabica-mode').find(':selected').val(), 'datepicker': $('#amadeoarabica-date').val(), 'timezone': utc }, function(data) {
            console.log("working amadeo arabica")
            try {
                chart6.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart6 = c3.generate({
                bindto: '#amadeoarabica-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#amadeoarabica-date-label').html( $('#amadeoarabica-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
             chart6.load({
               columns: [obj["deficiency1"], obj["deficiency2"]]
            });
            var x = document.getElementById("amadeo_aphos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("amadeo_apot_table");
            x.innerHTML = obj["deficiency2"][1];
        });

        }
    });
    $('#indangarabica-date').Zebra_DatePicker({
        format: 'm-d-Y',
        direction: false,
        onSelect: function (view, elements) {
            $.get('/indang_arabica_variety',{ 'mode': $('#indangarabica-mode').find(':selected').val(), 'datepicker': $('#indangarabica-date').val(), 'timezone': utc }, function(data) {
            console.log("working indang arabica")
            try {
                chart7.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart7 = c3.generate({
                bindto: '#indangarabica-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#indangarabica-date-label').html( $('#indangarabica-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
             chart7.load({
               columns: [obj["deficiency1"], obj["deficiency2"]]
            });
            var x = document.getElementById("indang_aphos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("indang_apot_table");
            x.innerHTML = obj["deficiency2"][1];

        });

        }
    });
    $('#indangrobusta-date').Zebra_DatePicker({
        format: 'm-d-Y',
        direction: false,
        onSelect: function (view, elements) {
            $.get('/indang_robusta_variety',{ 'mode': $('#indangrobusta-mode').find(':selected').val(), 'datepicker': $('#indangrobusta-date').val(), 'timezone': utc }, function(data) {
            console.log("working indang robusta")
            try {
                chart8.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart8 = c3.generate({
                bindto: '#indangrobusta-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#indangrobusta-date-label').html( $('#indangrobusta-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
            console.log(obj["deficiency"]);
             chart8.load({
               columns: [obj["deficiency1"], obj["deficiency2"],obj["deficiency3"],obj["deficiency4"],
               obj["deficiency5"],obj["deficiency6"],obj["deficiency7"],obj["deficiency8"],]
            });
            var x = document.getElementById("indang_rphos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("indang_rpot_table");
            x.innerHTML = obj["deficiency2"][1];
            var x = document.getElementById("indang_rcal_table");
            x.innerHTML = obj["deficiency3"][1];
            var x = document.getElementById("indang_rbo_table");
            x.innerHTML = obj["deficiency4"][1];
            var x = document.getElementById("indang_rir_table");
            x.innerHTML = obj["deficiency5"][1];
            var x = document.getElementById("indang_rmag_table");
            x.innerHTML = obj["deficiency6"][1];
            var x = document.getElementById("indang_rnit_table");
            x.innerHTML = obj["deficiency7"][1];
            var x = document.getElementById("indang_rzinc_table");
            x.innerHTML = obj["deficiency8"][1];
        });

        }
    });
    $('#indangliberica-date').Zebra_DatePicker({
        format: 'm-d-Y',
        direction: false,
        onSelect: function (view, elements) {
            $.get('/indang_liberica_variety',{ 'mode': $('#indangliberica-mode').find(':selected').val(), 'datepicker': $('#indangliberica-date').val(), 'timezone': utc }, function(data) {
            console.log("working indang liberica")
            try {
                chart9.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart9 = c3.generate({
                bindto: '#indangliberica-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#indangliberica-date-label').html( $('#indangliberica-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
            console.log(obj["deficiency"]);
             chart9.load({
               columns: [obj["deficiency1"], obj["deficiency2"]]
            });
            var x = document.getElementById("indang_lphos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("indang_lnit_table");
            x.innerHTML = obj["deficiency2"][1];
        });

        }
    });
    $('#amadeoexcela-date').Zebra_DatePicker({
        format: 'm-d-Y',
        direction: false,
        onSelect: function (view, elements) {
            $.get('/amadeo_excela_variety',{ 'mode': $('#amadeoexcela-mode').find(':selected').val(), 'datepicker': $('#amadeoexcela-date').val(), 'timezone': utc }, function(data) {
            console.log("working amadeo excela")
            try {
                chart10.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart10 = c3.generate({
                bindto: '#amadeoexcela-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#amadeoexcela-date-label').html( $('#amadeoexcela-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
             chart10.load({
               columns: [obj["deficiency1"], obj["deficiency2"], obj["deficiency3"]]
            });
            var x = document.getElementById("amadeo_ephos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("amadeo_epot_table");
            x.innerHTML = obj["deficiency2"][1];
            var x = document.getElementById("amadeo_ecal_table");
            x.innerHTML = obj["deficiency3"][1];
        });

        }
    });


    let date = new Date();
    $('#date').val( (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + '-' + date.getFullYear().toString() );
    $('#arabica-date').val( (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + '-' + date.getFullYear().toString() );
    $('#robusta-date').val( (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + '-' + date.getFullYear().toString() );
    $('#liberica-date').val( (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + '-' + date.getFullYear().toString() );
    $('#excela-date').val( (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + '-' + date.getFullYear().toString() );
    $('#amadeoarabica-date').val( (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + '-' + date.getFullYear().toString() );
    $('#indangarabica-date').val( (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + '-' + date.getFullYear().toString() );
    $('#indangrobusta-date').val( (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + '-' + date.getFullYear().toString() );
    $('#indangliberica-date').val( (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + '-' + date.getFullYear().toString() );
    $('#amadeoexcela-date').val( (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + '-' + date.getFullYear().toString() );


   $('#mode').change(function() {
        modeChange();
   });

   var modeChange = function() {

        let mode = $('#mode').find(':selected').val();
        let datepicker = $('#date').data('Zebra_DatePicker');
        let date = new Date();

        if (mode == 'day') {
            datepicker.update({
                format: 'm-d-Y',
                view: 'days'
            });

            $('#date').val( (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + '-' + date.getFullYear().toString() );
            chart_format = '%_I:%M:%S %p';
        }

        else if (mode == 'month') {
            datepicker.update({
                format: 'm-Y',
                view: 'months'
            });

            $('#date').val( (date.getMonth() + 1).toString() + '-' + date.getFullYear().toString() );
            chart_format = '%m-%d-%y';
        }

        else if (mode == 'year') {
            datepicker.update({
                format: 'Y',
                view: 'years'
            });

            $('#date').val( date.getFullYear().toString() );
            chart_format = '%m-%y';
        }

        $.get('/get_temperature_reading', { 'mode': $('#mode').find(':selected').val(), 'datepicker': $('#date').val(), 'timezone': utc }, function(data) {
            console.log("working temperature");
            try {
                chart.destroy();
            }
            catch (ex) {
                // Ignored
            }


            chart = c3.generate({

                bindto: '#graph',

                data: {
                    x: 'timestamp',
                    type: 'line',
                    columns: [
                        ['timestamp', ],
                        ['temperature', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                },
                zoom: {
                    enabled: true
                },
                point: {
                    show: true,
                },
                axis: {
                    x: {
                        tick: {
                            format: function (d) {
                                return d3.time.format(chart_format)(new Date(d));
                            },
                        },
                    },
                    y: {
                        tick: {
                            format: function (p) {
                                return parseFloat(p).toFixed(2) + ' C';
                            },
                        },
                    },
                },
            });
            $('#graph-date-label').html( $('#date').val() );

            let timestamp_reading = ['timestamp'];
            for (let n=0; n < data.timestamp.length; n++)
                timestamp_reading.push( new Date(data.timestamp[n]) );

            let temperature   = ['temperature'].concat(data.temperature);

            chart.load({
                columns: [timestamp_reading, temperature]
            });

        });

   };

   $('#arabica-mode').change(function() {
        arabicamodeChange();
   });

   var arabicamodeChange = function() {

        let mode = $('#arabica-mode').find(':selected').val();
        let datepicker = $('#arabica-date').data('Zebra_DatePicker');
        let date = new Date();

        if (mode == 'day') {
            datepicker.update({
                format: 'm-d-Y',
                view: 'days'
            });

            $('#arabica-date').val( (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + '-' + date.getFullYear().toString() );
            chart_format = '%_I:%M:%S %p';
        }

        else if (mode == 'month') {
            datepicker.update({
                format: 'm-Y',
                view: 'months'
            });

            $('#arabica-date').val( (date.getMonth() + 1).toString() + '-' + date.getFullYear().toString() );
            chart_format = '%m-%d-%y';
        }

        else if (mode == 'year') {
            datepicker.update({
                format: 'Y',
                view: 'years'
            });

            $('#arabica-date').val( date.getFullYear().toString() );
            chart_format = '%m-%y';
        }
        $.get('/arabica_variety',{ 'mode': $('#arabica-mode').find(':selected').val(), 'datepicker': $('#arabica-date').val(), 'timezone': utc }, function(data) {
            console.log("working arabica all");
            try {
                chart2.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart2 = c3.generate({
                bindto: '#arabica-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#arabica-date-label').html( $('#arabica-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
            console.log(obj["deficiency"]);
             chart2.load({
               columns: [obj["deficiency1"], obj["deficiency2"]]
            });
            var x = document.getElementById("total_aphos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("total_apot_table");
            x.innerHTML = obj["deficiency2"][1];
        });

   };

   $('#robusta-mode').change(function() {
        robustamodeChange();
   });

   var robustamodeChange = function() {

        let mode = $('#robusta-mode').find(':selected').val();
        let datepicker = $('#robusta-date').data('Zebra_DatePicker');
        let date = new Date();

        if (mode == 'day') {
            datepicker.update({
                format: 'm-d-Y',
                view: 'days'
            });

            $('#robusta-date').val( (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + '-' + date.getFullYear().toString() );
            chart_format = '%_I:%M:%S %p';
        }

        else if (mode == 'month') {
            datepicker.update({
                format: 'm-Y',
                view: 'months'
            });

            $('#robusta-date').val( (date.getMonth() + 1).toString() + '-' + date.getFullYear().toString() );
            chart_format = '%m-%d-%y';
        }

        else if (mode == 'year') {
            datepicker.update({
                format: 'Y',
                view: 'years'
            });

            $('#robusta-date').val( date.getFullYear().toString() );
            chart_format = '%m-%y';
        }
        $.get('/robusta_variety',{ 'mode': $('#robusta-mode').find(':selected').val(), 'datepicker': $('#robusta-date').val(), 'timezone': utc }, function(data) {
            console.log("working robusta all");
            try {
                chart3.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart3 = c3.generate({
                bindto: '#robusta-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#robusta-date-label').html( $('#robusta-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
            console.log(obj["deficiency"]);
             chart3.load({
               columns: [obj["deficiency1"], obj["deficiency2"],obj["deficiency3"],obj["deficiency4"],
               obj["deficiency5"],obj["deficiency6"],obj["deficiency7"],obj["deficiency8"],]
            });
            var x = document.getElementById("total_rphos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("total_rpot_table");
            x.innerHTML = obj["deficiency2"][1];
            var x = document.getElementById("total_rcal_table");
            x.innerHTML = obj["deficiency3"][1];
            var x = document.getElementById("total_rbo_table");
            x.innerHTML = obj["deficiency4"][1];
            var x = document.getElementById("total_rir_table");
            x.innerHTML = obj["deficiency5"][1];
            var x = document.getElementById("total_rmag_table");
            x.innerHTML = obj["deficiency6"][1];
            var x = document.getElementById("total_rnit_table");
            x.innerHTML = obj["deficiency7"][1];
            var x = document.getElementById("total_rzinc_table");
            x.innerHTML = obj["deficiency8"][1];

        });

   };

   $('#liberica-mode').change(function() {
        libericamodeChange();
   });

   var libericamodeChange = function() {

        let mode = $('#liberica-mode').find(':selected').val();
        let datepicker = $('#liberica-date').data('Zebra_DatePicker');
        let date = new Date();

        if (mode == 'day') {
            datepicker.update({
                format: 'm-d-Y',
                view: 'days'
            });

            $('#liberica-date').val( (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + '-' + date.getFullYear().toString() );
            chart_format = '%_I:%M:%S %p';
        }

        else if (mode == 'month') {
            datepicker.update({
                format: 'm-Y',
                view: 'months'
            });

            $('#liberica-date').val( (date.getMonth() + 1).toString() + '-' + date.getFullYear().toString() );
            chart_format = '%m-%d-%y';
        }

        else if (mode == 'year') {
            datepicker.update({
                format: 'Y',
                view: 'years'
            });

            $('#liberica-date').val( date.getFullYear().toString() );
            chart_format = '%m-%y';
        }

        $.get('/liberica_variety',{ 'mode': $('#liberica-mode').find(':selected').val(), 'datepicker': $('#liberica-date').val(), 'timezone': utc }, function(data) {
            console.log("working liberica all");
            try {
                chart4.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart4 = c3.generate({
                bindto: '#liberica-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#liberica-date-label').html( $('#liberica-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
             chart4.load({
               columns: [obj["deficiency1"], obj["deficiency2"]]
            });
            var x = document.getElementById("total_lphos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("total_lnit_table");
            x.innerHTML = obj["deficiency2"][1];
        });

   };

   $('#excela-mode').change(function() {
        excelamodeChange();
   });

   var excelamodeChange = function() {

        let mode = $('#excela-mode').find(':selected').val();
        let datepicker = $('#excela-date').data('Zebra_DatePicker');
        let date = new Date();

        if (mode == 'day') {
            datepicker.update({
                format: 'm-d-Y',
                view: 'days'
            });

            $('#excela-date').val( (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + '-' + date.getFullYear().toString() );
            chart_format = '%_I:%M:%S %p';
        }

        else if (mode == 'month') {
            datepicker.update({
                format: 'm-Y',
                view: 'months'
            });

            $('#excela-date').val( (date.getMonth() + 1).toString() + '-' + date.getFullYear().toString() );
            chart_format = '%m-%d-%y';
        }

        else if (mode == 'year') {
            datepicker.update({
                format: 'Y',
                view: 'years'
            });

            $('#excela-date').val( date.getFullYear().toString() );
            chart_format = '%m-%y';
        }

        $.get('/excela_variety',{ 'mode': $('#excela-mode').find(':selected').val(), 'datepicker': $('#excela-date').val(), 'timezone': utc }, function(data) {
            console.log("working excela all");
            try {
                chart5.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart5 = c3.generate({
                bindto: '#excela-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#excela-date-label').html( $('#excela-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
             chart5.load({
               columns: [obj["deficiency1"], obj["deficiency2"], obj["deficiency3"]]
            });
            var x = document.getElementById("total_ephos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("total_epot_table");
            x.innerHTML = obj["deficiency2"][1];
            var x = document.getElementById("total_ecal_table");
            x.innerHTML = obj["deficiency3"][1];
        });

   };

   $('#amadeoarabica-mode').change(function() {
        amadeoarabicamodeChange();
   });

   var amadeoarabicamodeChange = function() {

        let mode = $('#amadeoarabica-mode').find(':selected').val();
        let datepicker = $('#amadeoarabica-date').data('Zebra_DatePicker');
        let date = new Date();

        if (mode == 'day') {
            datepicker.update({
                format: 'm-d-Y',
                view: 'days'
            });

            $('#amadeoarabica-date').val( (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + '-' + date.getFullYear().toString() );
            chart_format = '%_I:%M:%S %p';
        }

        else if (mode == 'month') {
            datepicker.update({
                format: 'm-Y',
                view: 'months'
            });

            $('#amadeoarabica-date').val( (date.getMonth() + 1).toString() + '-' + date.getFullYear().toString() );
            chart_format = '%m-%d-%y';
        }

        else if (mode == 'year') {
            datepicker.update({
                format: 'Y',
                view: 'years'
            });

            $('#amadeoarabica-date').val( date.getFullYear().toString() );
            chart_format = '%m-%y';
        }

        $.get('/amadeo_arabica_variety',{ 'mode': $('#amadeoarabica-mode').find(':selected').val(), 'datepicker': $('#amadeoarabica-date').val(), 'timezone': utc }, function(data) {
            console.log("working amadeo arabica")
            try {
                chart6.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart6 = c3.generate({
                bindto: '#amadeoarabica-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#amadeoarabica-date-label').html( $('#amadeoarabica-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
             chart6.load({
               columns: [obj["deficiency1"], obj["deficiency2"]]
            });
            var x = document.getElementById("amadeo_aphos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("amadeo_apot_table");
            x.innerHTML = obj["deficiency2"][1];
        });

   };

   $('#indangarabica-mode').change(function() {
        indangarabicamodeChange();
   });

   var indangarabicamodeChange = function() {

        let mode = $('#indangarabica-mode').find(':selected').val();
        let datepicker = $('#indangarabica-date').data('Zebra_DatePicker');
        let date = new Date();

        if (mode == 'day') {
            datepicker.update({
                format: 'm-d-Y',
                view: 'days'
            });

            $('#indangarabica-date').val( (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + '-' + date.getFullYear().toString() );
            chart_format = '%_I:%M:%S %p';
        }

        else if (mode == 'month') {
            datepicker.update({
                format: 'm-Y',
                view: 'months'
            });

            $('#indangarabica-date').val( (date.getMonth() + 1).toString() + '-' + date.getFullYear().toString() );
            chart_format = '%m-%d-%y';
        }

        else if (mode == 'year') {
            datepicker.update({
                format: 'Y',
                view: 'years'
            });

            $('#indangarabica-date').val( date.getFullYear().toString() );
            chart_format = '%m-%y';
        }

        $.get('/indang_arabica_variety',{ 'mode': $('#indangarabica-mode').find(':selected').val(), 'datepicker': $('#indangarabica-date').val(), 'timezone': utc }, function(data) {
            console.log("working indang arabica")
            try {
                chart7.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart7 = c3.generate({
                bindto: '#indangarabica-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#indangarabica-date-label').html( $('#indangarabica-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
             chart7.load({
               columns: [obj["deficiency1"], obj["deficiency2"]]
            });
            var x = document.getElementById("indang_aphos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("indang_apot_table");
            x.innerHTML = obj["deficiency2"][1];

        });

   };

   $('#indangrobusta-mode').change(function() {
        indangrobustamodeChange();
   });

   var indangrobustamodeChange = function() {

        let mode = $('#indangrobusta-mode').find(':selected').val();
        let datepicker = $('#indangrobusta-date').data('Zebra_DatePicker');
        let date = new Date();

        if (mode == 'day') {
            datepicker.update({
                format: 'm-d-Y',
                view: 'days'
            });

            $('#indangrobusta-date').val( (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + '-' + date.getFullYear().toString() );
            chart_format = '%_I:%M:%S %p';
        }

        else if (mode == 'month') {
            datepicker.update({
                format: 'm-Y',
                view: 'months'
            });

            $('#indangrobusta-date').val( (date.getMonth() + 1).toString() + '-' + date.getFullYear().toString() );
            chart_format = '%m-%d-%y';
        }

        else if (mode == 'year') {
            datepicker.update({
                format: 'Y',
                view: 'years'
            });

            $('#indangrobusta-date').val( date.getFullYear().toString() );
            chart_format = '%m-%y';
        }

        $.get('/indang_robusta_variety',{ 'mode': $('#indangrobusta-mode').find(':selected').val(), 'datepicker': $('#indangrobusta-date').val(), 'timezone': utc }, function(data) {
            console.log("working indang robusta")
            try {
                chart8.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart8 = c3.generate({
                bindto: '#indangrobusta-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#indangrobusta-date-label').html( $('#indangrobusta-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
            console.log(obj["deficiency"]);
             chart8.load({
               columns: [obj["deficiency1"], obj["deficiency2"],obj["deficiency3"],obj["deficiency4"],
               obj["deficiency5"],obj["deficiency6"],obj["deficiency7"],obj["deficiency8"],]
            });
            var x = document.getElementById("indang_rphos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("indang_rpot_table");
            x.innerHTML = obj["deficiency2"][1];
            var x = document.getElementById("indang_rcal_table");
            x.innerHTML = obj["deficiency3"][1];
            var x = document.getElementById("indang_rbo_table");
            x.innerHTML = obj["deficiency4"][1];
            var x = document.getElementById("indang_rir_table");
            x.innerHTML = obj["deficiency5"][1];
            var x = document.getElementById("indang_rmag_table");
            x.innerHTML = obj["deficiency6"][1];
            var x = document.getElementById("indang_rnit_table");
            x.innerHTML = obj["deficiency7"][1];
            var x = document.getElementById("indang_rzinc_table");
            x.innerHTML = obj["deficiency8"][1];
        });

   };

   $('#indangliberica-mode').change(function() {
        indanglibericamodeChange();
   });

   var indanglibericamodeChange = function() {

        let mode = $('#indangliberica-mode').find(':selected').val();
        let datepicker = $('#indangliberica-date').data('Zebra_DatePicker');
        let date = new Date();

        if (mode == 'day') {
            datepicker.update({
                format: 'm-d-Y',
                view: 'days'
            });

            $('#indangliberica-date').val( (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + '-' + date.getFullYear().toString() );
            chart_format = '%_I:%M:%S %p';
        }

        else if (mode == 'month') {
            datepicker.update({
                format: 'm-Y',
                view: 'months'
            });

            $('#indangliberica-date').val( (date.getMonth() + 1).toString() + '-' + date.getFullYear().toString() );
            chart_format = '%m-%d-%y';
        }

        else if (mode == 'year') {
            datepicker.update({
                format: 'Y',
                view: 'years'
            });

            $('#indangliberica-date').val( date.getFullYear().toString() );
            chart_format = '%m-%y';
        }

        $.get('/indang_liberica_variety',{ 'mode': $('#indangliberica-mode').find(':selected').val(), 'datepicker': $('#indangliberica-date').val(), 'timezone': utc }, function(data) {
            console.log("working indang liberica")
            try {
                chart9.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart9 = c3.generate({
                bindto: '#indangliberica-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#indangliberica-date-label').html( $('#indangliberica-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
            console.log(obj["deficiency"]);
             chart9.load({
               columns: [obj["deficiency1"], obj["deficiency2"]]
            });
            var x = document.getElementById("indang_lphos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("indang_lnit_table");
            x.innerHTML = obj["deficiency2"][1];
        });

   };

   $('#amadeoexcela-mode').change(function() {
        amadeoexcelamodeChange();
   });

   var amadeoexcelamodeChange = function() {

        let mode = $('#amadeoexcela-mode').find(':selected').val();
        let datepicker = $('#amadeoexcela-date').data('Zebra_DatePicker');
        let date = new Date();

        if (mode == 'day') {
            datepicker.update({
                format: 'm-d-Y',
                view: 'days'
            });

            $('#amadeoexcela-date').val( (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + '-' + date.getFullYear().toString() );
            chart_format = '%_I:%M:%S %p';
        }

        else if (mode == 'month') {
            datepicker.update({
                format: 'm-Y',
                view: 'months'
            });

            $('#amadeoexcela-date').val( (date.getMonth() + 1).toString() + '-' + date.getFullYear().toString() );
            chart_format = '%m-%d-%y';
        }

        else if (mode == 'year') {
            datepicker.update({
                format: 'Y',
                view: 'years'
            });

            $('#amadeoexcela-date').val( date.getFullYear().toString() );
            chart_format = '%m-%y';
        }

        $.get('/amadeo_excela_variety',{ 'mode': $('#amadeoexcela-mode').find(':selected').val(), 'datepicker': $('#amadeoexcela-date').val(), 'timezone': utc }, function(data) {
            console.log("working amadeo excela")
            try {
                chart10.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart10 = c3.generate({
                bindto: '#amadeoexcela-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#amadeoexcela-date-label').html( $('#amadeoexcela-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
             chart10.load({
               columns: [obj["deficiency1"], obj["deficiency2"], obj["deficiency3"]]
            });
            var x = document.getElementById("amadeo_ephos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("amadeo_epot_table");
            x.innerHTML = obj["deficiency2"][1];
            var x = document.getElementById("amadeo_ecal_table");
            x.innerHTML = obj["deficiency3"][1];
        });

   };


   var update = function() {
        /*
            Last value
        */
        $.get('/get_last_temperature_reading', function(data) {

            let labelFormat = d3.time.format("%B %d, %Y, &nbsp; %I:%M:%S %p");

            $('#last-current-reading').html( parseFloat(data.value).toFixed(2) );
            $('#last-current-reading-date').html( labelFormat(new Date(data.timestamp)) );
        })
        .fail(function(data) {

            $('#last-current-reading').html(' NO DATA ');
            $('#last-current-reading-date').html('');
        });

        /*
            Graphs
        */

        $.get('/get_temperature_reading', { 'mode': $('#mode').find(':selected').val(), 'datepicker': $('#date').val(), 'timezone': utc }, function(data) {
            console.log("working update temperature");
            try {
                chart.destroy();
            }
            catch (ex) {
                // Ignored
            }


            chart = c3.generate({

                bindto: '#graph',

                data: {
                    x: 'timestamp',
                    type: 'line',
                    columns: [
                        ['timestamp', ],
                        ['temperature', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                },
                zoom: {
                    enabled: true
                },
                point: {
                    show: true,
                },
                axis: {
                    x: {
                        tick: {
                            format: function (d) {
                                return d3.time.format(chart_format)(new Date(d));
                            },
                        },
                    },
                    y: {
                        tick: {
                            format: function (p) {
                                return parseFloat(p).toFixed(2) + ' C';
                            },
                        },
                    },
                },
            });
            $('#graph-date-label').html( $('#date').val() );

            let timestamp_reading = ['timestamp'];
            for (let n=0; n < data.timestamp.length; n++)
                timestamp_reading.push( new Date(data.timestamp[n]) );

            let temperature   = ['temperature'].concat(data.temperature);

            chart.load({
                columns: [timestamp_reading, temperature]
            });

        });

        $.get('/arabica_variety',{ 'mode': $('#arabica-mode').find(':selected').val(), 'datepicker': $('#arabica-date').val(), 'timezone': utc }, function(data) {
            console.log("working update arabica all");
            try {
                chart2.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart2 = c3.generate({
                bindto: '#arabica-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#arabica-date-label').html( $('#arabica-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
            console.log(obj["deficiency"]);
             chart2.load({
               columns: [obj["deficiency1"], obj["deficiency2"]]
            });
            var x = document.getElementById("total_aphos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("total_apot_table");
            x.innerHTML = obj["deficiency2"][1];
        });

        $.get('/robusta_variety',{ 'mode': $('#robusta-mode').find(':selected').val(), 'datepicker': $('#robusta-date').val(), 'timezone': utc }, function(data) {
            console.log("working update robusta all");
            try {
                chart3.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart3 = c3.generate({
                bindto: '#robusta-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#robusta-date-label').html( $('#robusta-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
            console.log(obj["deficiency"]);
             chart3.load({
               columns: [obj["deficiency1"], obj["deficiency2"],obj["deficiency3"],obj["deficiency4"],
               obj["deficiency5"],obj["deficiency6"],obj["deficiency7"],obj["deficiency8"],]
            });
            var x = document.getElementById("total_rphos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("total_rpot_table");
            x.innerHTML = obj["deficiency2"][1];
            var x = document.getElementById("total_rcal_table");
            x.innerHTML = obj["deficiency3"][1];
            var x = document.getElementById("total_rbo_table");
            x.innerHTML = obj["deficiency4"][1];
            var x = document.getElementById("total_rir_table");
            x.innerHTML = obj["deficiency5"][1];
            var x = document.getElementById("total_rmag_table");
            x.innerHTML = obj["deficiency6"][1];
            var x = document.getElementById("total_rnit_table");
            x.innerHTML = obj["deficiency7"][1];
            var x = document.getElementById("total_rzinc_table");
            x.innerHTML = obj["deficiency8"][1];

        });

        $.get('/liberica_variety',{ 'mode': $('#liberica-mode').find(':selected').val(), 'datepicker': $('#liberica-date').val(), 'timezone': utc }, function(data) {
            console.log("working update liberica all");
            try {
                chart4.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart4 = c3.generate({
                bindto: '#liberica-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#liberica-date-label').html( $('#liberica-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
             chart4.load({
               columns: [obj["deficiency1"], obj["deficiency2"]]
            });
            var x = document.getElementById("total_lphos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("total_lnit_table");
            x.innerHTML = obj["deficiency2"][1];
        });

        $.get('/excela_variety',{ 'mode': $('#excela-mode').find(':selected').val(), 'datepicker': $('#excela-date').val(), 'timezone': utc }, function(data) {
            console.log("working update excela all");
            try {
                chart5.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart5 = c3.generate({
                bindto: '#excela-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#excela-date-label').html( $('#excela-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
             chart5.load({
               columns: [obj["deficiency1"], obj["deficiency2"], obj["deficiency3"]]
            });
            var x = document.getElementById("total_ephos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("total_epot_table");
            x.innerHTML = obj["deficiency2"][1];
            var x = document.getElementById("total_ecal_table");
            x.innerHTML = obj["deficiency3"][1];
        });

        $.get('/amadeo_arabica_variety',{ 'mode': $('#amadeoarabica-mode').find(':selected').val(), 'datepicker': $('#amadeoarabica-date').val(), 'timezone': utc }, function(data) {
            console.log("working update amadeo arabica")
            try {
                chart6.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart6 = c3.generate({
                bindto: '#amadeoarabica-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#amadeoarabica-date-label').html( $('#amadeoarabica-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
             chart6.load({
               columns: [obj["deficiency1"], obj["deficiency2"]]
            });
            var x = document.getElementById("amadeo_aphos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("amadeo_apot_table");
            x.innerHTML = obj["deficiency2"][1];
        });

        $.get('/indang_arabica_variety',{ 'mode': $('#indangarabica-mode').find(':selected').val(), 'datepicker': $('#indangarabica-date').val(), 'timezone': utc }, function(data) {
            console.log("working update indang arabica")
            try {
                chart7.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart7 = c3.generate({
                bindto: '#indangarabica-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#indangarabica-date-label').html( $('#indangarabica-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
             chart7.load({
               columns: [obj["deficiency1"], obj["deficiency2"]]
            });
            var x = document.getElementById("indang_aphos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("indang_apot_table");
            x.innerHTML = obj["deficiency2"][1];

        });

        $.get('/indang_robusta_variety',{ 'mode': $('#indangrobusta-mode').find(':selected').val(), 'datepicker': $('#indangrobusta-date').val(), 'timezone': utc }, function(data) {
            console.log("working update indang robusta")
            try {
                chart8.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart8 = c3.generate({
                bindto: '#indangrobusta-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#indangrobusta-date-label').html( $('#indangrobusta-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
            console.log(obj["deficiency"]);
             chart8.load({
               columns: [obj["deficiency1"], obj["deficiency2"],obj["deficiency3"],obj["deficiency4"],
               obj["deficiency5"],obj["deficiency6"],obj["deficiency7"],obj["deficiency8"],]
            });
            var x = document.getElementById("indang_rphos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("indang_rpot_table");
            x.innerHTML = obj["deficiency2"][1];
            var x = document.getElementById("indang_rcal_table");
            x.innerHTML = obj["deficiency3"][1];
            var x = document.getElementById("indang_rbo_table");
            x.innerHTML = obj["deficiency4"][1];
            var x = document.getElementById("indang_rir_table");
            x.innerHTML = obj["deficiency5"][1];
            var x = document.getElementById("indang_rmag_table");
            x.innerHTML = obj["deficiency6"][1];
            var x = document.getElementById("indang_rnit_table");
            x.innerHTML = obj["deficiency7"][1];
            var x = document.getElementById("indang_rzinc_table");
            x.innerHTML = obj["deficiency8"][1];
        });

        $.get('/indang_liberica_variety',{ 'mode': $('#indangliberica-mode').find(':selected').val(), 'datepicker': $('#indangliberica-date').val(), 'timezone': utc }, function(data) {
            console.log("working update indang liberica")
            try {
                chart9.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart9 = c3.generate({
                bindto: '#indangliberica-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#indangliberica-date-label').html( $('#indangliberica-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
            console.log(obj["deficiency"]);
             chart9.load({
               columns: [obj["deficiency1"], obj["deficiency2"]]
            });
            var x = document.getElementById("indang_lphos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("indang_lnit_table");
            x.innerHTML = obj["deficiency2"][1];
        });

        $.get('/amadeo_excela_variety',{ 'mode': $('#amadeoexcela-mode').find(':selected').val(), 'datepicker': $('#amadeoexcela-date').val(), 'timezone': utc }, function(data) {
            console.log("working update amadeo excela")
            try {
                chart10.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart10 = c3.generate({
                bindto: '#amadeoexcela-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5 // this makes bar width 50% of length between ticks
                    }
                    // or
                    //width: 100 // this makes bar width 100px
                }
            });
            $('#amadeoexcela-date-label').html( $('#amadeoexcela-date').val() );
            var obj = JSON.parse(JSON.stringify(data));
             chart10.load({
               columns: [obj["deficiency1"], obj["deficiency2"], obj["deficiency3"]]
            });
            var x = document.getElementById("amadeo_ephos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("amadeo_epot_table");
            x.innerHTML = obj["deficiency2"][1];
            var x = document.getElementById("amadeo_ecal_table");
            x.innerHTML = obj["deficiency3"][1];
        });

        $.get('/amadeo_variety', function(data) {
            console.log("working update amadeo")
            try {
                chart11.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart11 = c3.generate({
                bindto: '#amadeo-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'pie'
                },
            });
            var obj = JSON.parse(JSON.stringify(data));
             chart11.load({
               columns: [obj["deficiency1"], obj["deficiency2"], obj["deficiency3"]]
            });
            var x = document.getElementById("amadeo_phos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("amadeo_pot_table");
            x.innerHTML = obj["deficiency2"][1];
            var x = document.getElementById("amadeo_cal_table");
            x.innerHTML = obj["deficiency3"][1];

        });

        $.get('/indang_variety', function(data) {
            console.log("working update indang")
            try {
                chart12.destroy();
            }
            catch (ex) {
                // Ignored
            }
            chart12 = c3.generate({
                bindto: '#indang-graph',

                data: {
                    columns: [
                        ['Deficiency', ],
                        ['Total', ],
                    ],
                    empty: {
                        label: {
                            text: "No Data Available"
                        }
                    },
                    type: 'pie'
                },
            });

            var obj = JSON.parse(JSON.stringify(data));
             chart12.load({
               columns: [obj["deficiency1"], obj["deficiency2"],obj["deficiency3"],obj["deficiency4"],
               obj["deficiency5"],obj["deficiency6"],obj["deficiency7"],obj["deficiency8"]]
            });
            var x = document.getElementById("indang_phos_table");
            x.innerHTML = obj["deficiency1"][1];
            var x = document.getElementById("indang_pot_table");
            x.innerHTML = obj["deficiency2"][1];
            var x = document.getElementById("indang_cal_table");
            x.innerHTML = obj["deficiency3"][1];
            var x = document.getElementById("indang_bo_table");
            x.innerHTML = obj["deficiency4"][1];
            var x = document.getElementById("indang_ir_table");
            x.innerHTML = obj["deficiency5"][1];
            var x = document.getElementById("indang_mag_table");
            x.innerHTML = obj["deficiency6"][1];
            var x = document.getElementById("indang_nit_table");
            x.innerHTML = obj["deficiency7"][1];
            var x = document.getElementById("indang_zinc_table");
            x.innerHTML = obj["deficiency8"][1];


        });

        $.get('/table_arabica', function(data) {
            var obj = JSON.parse(JSON.stringify(data));
            var x = document.getElementById("total_aphos");
            x.innerHTML = obj["total_phos"];
            var x = document.getElementById("total_apot");
            x.innerHTML = obj["total_pot"];
            var x = document.getElementById("amadeo_aphos");
            x.innerHTML = obj["amadeo_phos"];
            var x = document.getElementById("amadeo_apot");
            x.innerHTML = obj["amadeo_pot"];
            var x = document.getElementById("indang_aphos");
            x.innerHTML = obj["indang_phos"];
            var x = document.getElementById("indang_apot");
            x.innerHTML = obj["indang_pot"];
        });

        $.get('/table_robusta', function(data) {
            var obj = JSON.parse(JSON.stringify(data));
            var x = document.getElementById("total_rphos");
            x.innerHTML = obj["total_phos"];
            var x = document.getElementById("total_rpot");
            x.innerHTML = obj["total_pot"];
            var x = document.getElementById("total_rcal");
            x.innerHTML = obj["total_calcium"];
            var x = document.getElementById("total_rbo");
            x.innerHTML = obj["total_boron"];
            var x = document.getElementById("total_rir");
            x.innerHTML = obj["total_iron"];
            var x = document.getElementById("total_rmag");
            x.innerHTML = obj["total_magnesium"];
            var x = document.getElementById("total_rnit");
            x.innerHTML = obj["total_nitrogen"];
            var x = document.getElementById("total_rzinc");
            x.innerHTML = obj["total_zinc"];
            var x = document.getElementById("indang_rphos");
            x.innerHTML = obj["indang_phos"];
            var x = document.getElementById("indang_rpot");
            x.innerHTML = obj["indang_pot"];
            var x = document.getElementById("indang_rcal");
            x.innerHTML = obj["indang_calcium"];
            var x = document.getElementById("indang_rbo");
            x.innerHTML = obj["indang_boron"];
            var x = document.getElementById("indang_rir");
            x.innerHTML = obj["indang_iron"];
            var x = document.getElementById("indang_rmag");
            x.innerHTML = obj["indang_magnesium"];
            var x = document.getElementById("indang_rnit");
            x.innerHTML = obj["indang_nitrogen"];
            var x = document.getElementById("indang_rzinc");
            x.innerHTML = obj["indang_zinc"];
        });

        $.get('/table_liberica', function(data) {
            var obj = JSON.parse(JSON.stringify(data));
            var x = document.getElementById("total_lphos");
            x.innerHTML = obj["total_phos"];
            var x = document.getElementById("total_lnit");
            x.innerHTML = obj["total_nit"];
            var x = document.getElementById("indang_lphos");
            x.innerHTML = obj["indang_phos"];
            var x = document.getElementById("indang_lnit");
            x.innerHTML = obj["indang_nit"];
        });

        $.get('/table_excela', function(data) {
            var obj = JSON.parse(JSON.stringify(data));
            var x = document.getElementById("total_ephos");
            x.innerHTML = obj["total_phos"];
            var x = document.getElementById("total_epot");
            x.innerHTML = obj["total_pot"];
            var x = document.getElementById("total_ecal");
            x.innerHTML = obj["total_calcium"];
            var x = document.getElementById("amadeo_ephos");
            x.innerHTML = obj["amadeo_phos"];
            var x = document.getElementById("amadeo_epot");
            x.innerHTML = obj["amadeo_pot"];
            var x = document.getElementById("amadeo_ecal");
            x.innerHTML = obj["amadeo_calcium"];
        });



   };

    $('.dropdown-menu').on('click', function (e) {
        e.stopPropagation();
    });

    $('#logout a').click(function() {
        $.get('/logout', function() {
            location.href = '/';
        });
    });


    setInterval(function() {
            update();
        }, 5000);

});
