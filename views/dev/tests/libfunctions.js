/* INCLUDE:
old: js/6alib/core.js
old: js/6alib/dom.js
old: js/6alib/json.js
old: js/6alib/httpreq.js
old: js/6alib/hourglass.js
old: js/6alib/inputcomplete.js
old: js/6alib/datasource.js
old: js/6alib/selectable_table.js

old: js/6alib/checkallbutton.js

old: js/6alib/progressbar.js
old: js/6alib/ljprogressbar.js

old: js/6alib/ippu.js
old: js/6alib/lj_ippu.js
old: js/6alib/template.js
old: js/6alib/userpicselect.js

old: js/6alib/view.js
old: js/6alib/directorysearch.js
old: js/6alib/directorysearchconstraints.js
old: js/6alib/directorysearchresults.js

old: js/6alib/esnmanager.js

old: js/6alib/ljwidget.js
old: js/6alib/ljwidget_ippu.js
old: js/6alib/widget_ippu/settingprod.js
*/

module( "old" );
test( "misc utils", function() {
    expect(5);

    var o;
    o = new Hourglass();
    o.init();
    ok( o, "Hourglass" );

    o = new InputComplete();
    o.init();
    ok( o, "InputComplete" );

    o = new InputCompleteData();
    o.init();
    ok( o, "InputCompleteData" );

    o = new DataSource();
    o.init();
    ok( o, "DataSource" );

    o = new SelectableTable();
    o.init({
        table: $("userpicselect_t")
    });
    ok( o, "SelectableTable" );

});
test( "LJProgressBar", function() {
    expect(2);

    var o;
    o = new ProgressBar();
    o.init();
    ok( o, "ProgressBar" );

    o = new LJProgressBar();
    o.init();
    ok( o, "LJProgressBar" );
});

test( "UserpicSelect", function() {
    expect(4);

    var o;
    o = new IPPU();
    o.init();
    ok( o, "IPPU" );

    o = new LJ_IPPU();
    o.init();
    ok( o, "LJ_IPPU" );

    o = new Template();
    o.init();
    ok( o, "Template" );

    o = new UserpicSelect();
    o.init();
    ok( o, "UserpicSelect" );
});

test( "Directory", function() {
    expect(6);

    var o;
    o = new View();
    o.init({});
    ok( o, "View" );

    o = new DirectorySearchView();
    o.init($("searchview"), {});
    ok( o, "DirectorySearchView" );

    o = new DirectorySearch();
    o.init() ;
    ok( o, "DirectorySearch" );

    o = new DirectorySearchResults();
    o.init({}, {"resultsView": $("searchresults")});
    ok( o, "DirectorySearchResults" );

    o = new DirectorySearchConstraintsView();
    o.init({view: $("searchconstraints")});
    ok( o, "DirectorySearchConstraintsView" );

    o = new DirectorySearchConstraint();
    o.init();
    ok( o, "DirectorySearchConstraint" );
});

test( "ESN", function() {
    expect(1);

    var o;

    // possibly unused?
    o = new ESNManager();
    o.init();
    ok( o, "ESNManager" );
});

test( "Widget", function() {
    expect(2);

    var o;
    o = new LJWidget();
    o.init();
    ok( o, "LJWidget" );

    o = new LJWidgetIPPU();
    o.init({});
    ok( o, "LJWidgetIPPU" );

    // automatically tries to post to something on page refresh, so leaving out
    // o = new LJWidgetIPPU_SettingProd();
    // o.init({}, {});
    // ok( o, "LJWidgetIPPU_SettingProd" );
});

test( "Check all", function() {
    expect(1);

    var o;
    o = new CheckallButton();
    o.init({ button: $("checkall") });
    ok( o, "CheckallButton" );
});

test( "array tests", function () {
    expect(4);

    var array = new Array();
    array.push( "a" );
    array.push( "b" );
    array.push( "c" );

    equals( 3, array.length, "Check array size" );

    array.forEach(function(element, index, array) {
        equals( element, array[index] );
    });
});

module( "jquery" );
test( "array tests", function () {
    expect(4);

    var array = new Array();
    array.push( "a" );
    array.push( "b" );
    array.push( "c" );

    equals( 3, array.length, "Check array size" );

    $.each( array, function(index, element) {
        equals( element, array[index] );
    });
});

module( "*libfunctions" );
test("object tests", function() {
    // expect(1);

    var o = new Object();
    o["a"] = "apple";
    o["b"] = "banana";
    o["c"] = "cat eating a banana";

    var count = 0;
    for( var key in o ) {
        count++;
    }
    equals( 3, count );

    o = new Object();
    count = 0;
    for ( var key in o ) {
        count++;
    }
    equals( 0, count );

});


