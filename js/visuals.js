var mac_authors = JSON.parse($.ajax({type: "GET", url: "https://raw.githubusercontent.com/mcmaster-eng/standardized-citations/main/json/mac_authors.json", async: false}).responseText);
var table1 = $('#table1').DataTable( {
  data: mac_authors,
  //"bFilter": false,
  "bInfo": false,
  "bLengthChange": false,
  "bPaginate": false,
  "bAutoWidth": true,
  "sScrollX": "100%",
  "sScrollY": "200px",
  "language": {
    searchPlaceholder: "Search keywords",
    search: "",
  },
  "columnDefs": [
    {
        "targets": [1],
        "visible": false,
        "searchable": false
    },
  ],
  "order": [[2, "asc" ]],
  columns: [
      { title: 'Author', data: 'author', className: 'dt-left' },
      { title: 'Faculty', data: 'faculty' },
      { title: 'Overall Rank', data: 'rank_ns' },
      { title: 'Top Ranked Subfield', data: 'subfield', className: 'dt-left' },
      { title: 'Subfield Rank', data: 'subfield_rank' },
  ],
  "createdRow": function(row, data, index){
      if(data['faculty'] == 'McMaster University, Faculty of Engineering'){
        $(row).addClass('boldRow');
      }
  },
});

// Setup default data and data dictionary to utilize when selecting a new subject or dataset
var ai_ = JSON.parse($.ajax({type: "GET", url: "https://raw.githubusercontent.com/mcmaster-eng/standardized-citations/main/json/AI_.json", async: false}).responseText);
dsets = {"ai_":"AI_","app_phys_":"APPLPHYS_","biomed_":"BIOMED_","chemicale_":"CHEMICALE_","chemicalp_":"CHEMICALP_","civil_":"CIVIL_","ece_":"ECE_","educ_":"EDUC_","energy_":"ENERGY_","enviro_":"ENVIRO_","geomatics_":"GEOMATIC_","indust_":"INDUST_","logist_":"LOGIST_","material_":"MATERIALS_","mechanical_":"MECHANICAL_","metal_":"METAL_","network_":"NETWORK_","opticselec_":"OPTOELEC_","polymer_":"POLYMERS_","softwr_":"SOFTWR_"}


var table2 = $('#table2').DataTable( {
  data: ai_,
  //"bFilter": false,
  "bInfo": false,
  "bLengthChange": false,
  "bPaginate": false,
  "bAutoWidth": true,
  "sScrollX": "100%",
  "sScrollY": "250px",
  "order": [[ 3, "asc" ]],
  "language": {
    searchPlaceholder: "Search keywords",
    search: "",
  },
  columns: [
      { title: 'Author', data: 'author', className: 'dt-left' },
      { title: 'Country', data: 'country', className: 'dt-left' },
      { title: 'Institution', data: 'institution', className: 'dt-left', width:'12%'},
      { title: 'Overall Rank', data: 'rank_ns' },
      { title: 'Composite Score', data: 'comp_score' },
      /*{ title: '', data: 'comp_score', orderable: false, render: function(data, type, row, meta){
            return $("<div></div>", {
                "class": "bar-chart-bar"
            }).append(function(){
                var bars = [];
                bars.push($("<div></div>",{
                    "class": "bar bar1"
                }).css({
                    "width": data + "%"
                }))
                return bars;
            }).prop("outerHTML")
        }
      },
      { title: 'QI', data: 'QI_PUB', render: function(data, type, row, meta) {
        return type === 'display' ?
        '<progress value="' + data + '" max="100" ><span></span></progress>': data;
        }
      },*/
      { title: 'H Index', data: 'hindex' },
      { title: 'HM Index', data: 'hmindex' },
      { title: 'Citations', data: 'total_cites' },
      { title: 'Distinct Citing Papers', data: 'distinct_papers' },
      { title: 'Citations : Distinct Papers', data: 'ratio_cp' },
  ],
  "createdRow": function(row, data, index){
      if(data['institution'] == 'McMaster University, Faculty of Engineering'){
        $(row).addClass('boldRow');
      }
  },
});

function changeTable(){
  var subject = document.getElementsByClassName("subDrop activeClear")[0].title;
  var newSelection = dsets[subject];
  var link = ["https://raw.githubusercontent.com/mcmaster-eng/standardized-citations/main/json/",newSelection,".json"].join('')
  var table_update = JSON.parse($.ajax({type: "GET", url: link, async: false}).responseText);
  table2.clear().draw();
  table2.rows.add(table_update).draw();
};


//am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_dark);

// *************************************************************

// Create chart instance
var chart = am4core.create("chartdiv", am4charts.XYChart);

chart.data = ai_;
chart.zoomOutButton.disabled = true;
chart.scrollbarX = new am4core.Scrollbar();
chart.cursor = new am4charts.XYCursor();
chart.cursor.lineY.disabled = true;
chart.cursor.lineX.disabled = true;
chart.paddingTop = "60px";
chart.paddingLeft = "50px";
chart.paddingRight = "60px";

var valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
valueAxisX.renderer.ticks.template.disabled = true;
valueAxisX.renderer.axisFills.template.disabled = true;
valueAxisX.renderer.labels.template.fillOpacity = 0.5;
valueAxisX.renderer.labels.template.fontSize = 10;
//valueAxisX.renderer.labels.template.disabled = false;
valueAxisX.renderer.grid.template.disabled = true;
valueAxisX.title.text = "Overall Ranking";
valueAxisX.title.fontSize = 12;
valueAxisX.title.fillOpacity = 0.5;
valueAxisX.max = 500000;

// Settings below will preset the zoom section bar
//valueAxisX.start = 0.8;
//valueAxisX.end = 1;
//valueAxisX.keepSelection = true;

var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
valueAxisY.renderer.ticks.template.disabled = true;
valueAxisY.renderer.axisFills.template.disabled = true;
valueAxisY.renderer.grid.template.strokeOpacity = 0.1;
valueAxisY.renderer.labels.template.fillOpacity = 0.5;
valueAxisY.renderer.labels.template.fontSize = 10;
valueAxisY.title.text = "Composite Score";
valueAxisY.title.dy = 40;
valueAxisY.title.fontSize = 12;
valueAxisY.title.fillOpacity = 0.5;
valueAxisY.min = 0;
valueAxisY.max = 8;

var series = chart.series.push(new am4charts.XYSeries());
series.dataFields.valueX = "rank_ns";
series.dataFields.valueY = "comp_score";
//series.dataFields.value = "acad_rep";
series.dataFields.id = "institution";
series.strokeOpacity = 1;
series.sequencedInterpolation = false;
series.tooltip.pointerOrientation = "vertical";
//series.minBulletDistance = 4;

// This ensures start up animations occur whenever the subject or ranking filter changes
//chart.events.on("datavalidated", function(ev) {
//  chart.series.each(function(series) {
//    series.appear();
//  });
//});

var bullet = series.bullets.push(new am4core.Circle());
bullet.fill = am4core.color("#ff0000");
bullet.propertyFields.fill = "colour";
bullet.strokeOpacity = 0;
bullet.strokeWidth = 2;
bullet.fillOpacity = 0.5;
bullet.stroke = am4core.color("#ffffff");
bullet.hiddenState.properties.opacity = 0;
//bullet.tooltipText = "{author}";
bullet.tooltipText = "[bold]{author}[/]\n\nRank: {rank_ns}\n\Composite Score: {comp_score}\n----------------\nTop Subfield: {subfield_one}\nSubfield Rank: {subfield_rank}\n----------------\nTotal Citations: {total_cites}\nH-Index: {hindex}\nHM-Index: {hmindex}";
//bullet.width = 10;
//bullet.height = 10;

// USE THIS IF YOU AREN'T GOING TO SIZE THE CIRCLES WITH A VARIABLE !
bullet.adapter.add("radius", function(radius, target) {
   if (target.dataItem) {
     if (target.dataItem.id.includes("McMaster University")) {
       radius = 20;
     }
     else {
       radius = 4;
     }
     return radius;
   }
});

var outline = chart.plotContainer.createChild(am4core.Circle);
outline.fillOpacity = 0;
outline.strokeOpacity = 0.8;
outline.stroke = am4core.color("#ff0000");
outline.strokeWidth = 2;
outline.hide(0);

var blurFilter = new am4core.BlurFilter();
outline.filters.push(blurFilter);

bullet.events.on("over", function(event) {
    var target = event.target;
    chart.cursor.triggerMove({ x: target.pixelX, y: target.pixelY }, "hard");
    chart.cursor.lineX.y = target.pixelY;
    chart.cursor.lineY.x = target.pixelX - chart.plotContainer.pixelWidth;
    valueAxisX.tooltip.disabled = true;
    valueAxisY.tooltip.disabled = true;
    outline.radius = target.pixelRadius + 2;
    outline.x = target.pixelX;
    outline.y = target.pixelY;
    outline.show();
})

bullet.events.on("out", function(event) {
    chart.cursor.triggerMove(event.pointer.point, "none");
    chart.cursor.lineX.y = 0;
    chart.cursor.lineY.x = 0;
    valueAxisX.tooltip.disabled = true;
    valueAxisY.tooltip.disabled = true;
    outline.hide();
})

//series.heatRules.push({ target: bullet, min: 2, max: 20, property: "radius" });

// --------------------------------------
// Example of native amcharts button!

var viewButtons = chart.plotContainer.createChild(am4core.Container);
viewButtons.shouldClone = false;
viewButtons.align = "left";
viewButtons.valign = "top";
viewButtons.marginTop = -75;
viewButtons.marginLeft = 5;
viewButtons.layout = "horizontal";

var vbutton2 = viewButtons.createChild(am4core.Button);
vbutton2.label.text = "Top 10,000";
vbutton2.padding(5, 5, 5, 5);
vbutton2.width = 100;
vbutton2.align = "right";
vbutton2.marginTop = 15;
vbutton2.marginRight = 5;
vbutton2.fontSize = 11;
vbutton2.events.on("hit", function() {
  valueAxisX.start = 0;
  valueAxisX.end = 0.02;
  valueAxisX.keepSelection = true;
});
var vbutton3 = viewButtons.createChild(am4core.Button);
vbutton3.label.text = "Top 50,000";
vbutton3.padding(5, 5, 5, 5);
vbutton3.width = 100;
vbutton3.align = "right";
vbutton3.marginTop = 15;
vbutton3.marginRight = 5;
vbutton3.fontSize = 11;
vbutton3.events.on("hit", function() {
  valueAxisX.start = 0;
  valueAxisX.end = 0.1;
  valueAxisX.keepSelection = true;
});
var vbutton5 = viewButtons.createChild(am4core.Button);
vbutton5.label.text = "MAX";
vbutton5.padding(5, 5, 5, 5);
vbutton5.width = 100;
vbutton5.align = "right";
vbutton5.marginTop = 15;
vbutton5.marginRight = 5;
vbutton5.fontSize = 11;
vbutton5.events.on("hit", function() {
  valueAxisX.start = 0;
  valueAxisX.end = 1;
  valueAxisX.keepSelection = true;
});

var axisButtons = chart.plotContainer.createChild(am4core.Container);
axisButtons.shouldClone = false;
axisButtons.align = "left";
axisButtons.valign = "top";
axisButtons.marginTop = 0;
axisButtons.marginLeft = 5;
axisButtons.layout = "horizontal";

var axbutton1 = axisButtons.createChild(am4core.Button);
axbutton1.label.text = "Composite Score";
axbutton1.padding(5, 5, 5, 5);
axbutton1.width = 100;
axbutton1.marginTop = 5;
axbutton1.marginRight = 5;
axbutton1.fontSize = 11;
axbutton1.events.on("hit", function() {
  series.dataFields.valueY = "comp_score";
  valueAxisY.title.text = "Composite Score";
  valueAxisY.max = 8;
  chart.invalidateData();
});

var axbutton2 = axisButtons.createChild(am4core.Button);
axbutton2.label.text = "H-Index";
axbutton2.padding(5, 5, 5, 5);
axbutton2.width = 100;
axbutton2.marginTop = 5;
axbutton2.marginRight = 5;
axbutton2.fontSize = 11;
axbutton2.events.on("hit", function() {
  series.dataFields.valueY = "hindex";
  valueAxisY.title.text = "H-Index";
  valueAxisY.max = 220;
  chart.invalidateData();
});

var axbutton3 = axisButtons.createChild(am4core.Button);
axbutton3.label.text = "HM-Index";
axbutton3.padding(5, 5, 5, 5);
axbutton3.width = 100;
axbutton3.marginTop = 5;
axbutton3.marginRight = 5;
axbutton3.fontSize = 11;
axbutton3.events.on("hit", function() {
  series.dataFields.valueY = "hmindex";
  valueAxisY.title.text = "HM-Index";
  valueAxisY.max = 100;
  chart.invalidateData();
});


chart.responsive.useDefault = false
chart.responsive.enabled = true;
chart.responsive.rules.push({
  relevant: function(target) {
    if (target.pixelWidth <= 600) {
      return true;
    }

    return false;
  },
  state: function(target, stateId) {
    if (target instanceof am4charts.Chart) {
      var state = target.states.create(stateId);
      state.properties.paddingTop = 2;
      return state;
    }
    if (target instanceof am4core.Button) {
      var state = target.states.create(stateId);
      state.properties.disabled = true;
      return state;
    }
    return null;
  }
});




// Create map instance
var chart_map = am4core.create("chartdiv_map", am4maps.MapChart);
chart_map.paddingBottom = "45px";

// Set projection
chart_map.projection = new am4maps.projections.Mercator();

// Prevent zooming in by wheeling
chart_map.chartContainer.wheelable = false;

var restoreView = function(){
  chart_map.goHome();
};

// Zoom button
chart_map.zoomControl = new am4maps.ZoomControl();
chart_map.zoomControl.align = "left";
chart_map.zoomControl.valign = "top";
chart_map.maxZoomLevel = 7;

// Home button
var homeButton = new am4core.Button();
homeButton.events.on("hit", restoreView);
homeButton.icon = new am4core.Sprite();
homeButton.padding(7, 5, 7, 5);
homeButton.width = 30;
homeButton.fill = am4core.color('#ffffff');
homeButton.icon.path = "M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8";
homeButton.marginBottom = 10;
homeButton.parent = chart_map.zoomControl;
homeButton.insertBefore(chart_map.zoomControl.plusButton);

// Countries
var countriesSeries = chart_map.series.push(new am4maps.MapPolygonSeries());
var countries = countriesSeries.mapPolygons;
countriesSeries.visible = true;
countriesSeries.exclude = ["AQ"];
countriesSeries.geodata = am4geodata_worldLow;
countriesSeries.useGeodata = true;

// Add heat rule
countriesSeries.heatRules.push({
  "property": "fill",
  "target": countriesSeries.mapPolygons.template,
  "min": am4core.color("#ca97ad"),
  "max": am4core.color("#7a003d"),
  "minValue": 0,
  "maxValue": 35,
});

var heatLegend = chart_map.createChild(am4charts.HeatLegend);
heatLegend.minColor = am4core.color("#ca97ad");
heatLegend.maxColor = am4core.color("#7a003d");
heatLegend.minValue = 0;
heatLegend.maxValue = .35;
heatLegend.valueAxis.renderer.labels.template.fontSize = 9;
heatLegend.valign = "bottom";
heatLegend.align = "center";
heatLegend.dy = 70;
heatLegend.width = am4core.percent(50);
heatLegend.markerContainer.height = 1;
heatLegend.orientation = "horizontal";
heatLegend.padding(20, 20, 20, 20);
heatLegend.numberFormatter.numberFormat = "#%";



var ai_geo = JSON.parse($.ajax({type: "GET", url: "https://raw.githubusercontent.com/mcmaster-eng/standardized-citations/main/json/AI_geo.json", async: false}).responseText);
geo_dsets = {"ai_":"AI_geo","app_phys_":"APPLPHYS_geo","biomed_":"BIOMED_geo","chemicale_":"CHEMICALE_geo","chemicalp_":"CHEMICALP_geo","civil_":"CIVIL_geo","ece_":"ECE_geo","educ_":"EDUC_geo","energy_":"ENERGY_geo","enviro_":"ENVIRO_geo","geomatics_":"GEOMATIC_geo","indust_":"INDUST_geo","logist_":"LOGIST_geo","material_":"MATERIALS_geo","mechanical_":"MECHANICAL_geo","metal_":"METAL_geo","network_":"NETWORK_geo","opticselec_":"OPTICSELEC_geo","polymer_":"POLYMER_geo","softwr_":"SOFTWR_geo"};

countriesSeries.data = ai_geo;

var countryTemplate = countries.template;
countryTemplate.applyOnClones = true;
countryTemplate.fill = am4core.color("#d4e0de");
countryTemplate.fillOpacity = 1; // see continents underneath, however, country shapes are more detailed than continents.
countryTemplate.strokeOpacity = 0.5;
countryTemplate.nonScalingStroke = true;

countryTemplate.tooltipHTML = `<center><strong>{name}</strong></center>
  <hr/><center>{percent_display}</center>
  <center>{count_display}</center>`;

countriesSeries.tooltip.getFillFromObject = false;
countriesSeries.tooltip.background.fill = am4core.color("#999999");
countriesSeries.tooltip.background.fillOpacity = 1;


var hoverColor = am4core.color("#ffffff");
var countryHover = countryTemplate.states.create("hover");
//countryHover.properties.fill = hoverColor;
//countryHover.properties.fillOpacity = 0.8; // Reduce conflict with back to continents map label
countryHover.properties.stroke = hoverColor;
countryHover.properties.strokeOpacity = 1;
countryHover.properties.strokeWidth = 1;

var labelContainer = chart_map.chartContainer.createChild(am4core.Container);
labelContainer.hide();
labelContainer.config = {cursorOverStyle: [
  {
    "property": "cursor",
    "value": "pointer"
  }
]};
labelContainer.isMeasured = false;
labelContainer.layout = "horizontal";
labelContainer.verticalCenter = "bottom";
labelContainer.contentValign = "middle";
labelContainer.y = am4core.percent(100);
labelContainer.dx = 10;
labelContainer.dy = -25;
labelContainer.background.fill = am4core.color("#fff");
labelContainer.background.fillOpacity = 0; // Hack to ensure entire area of labelContainer, e.g. between icon path, is clickable
labelContainer.setStateOnChildren = true;
labelContainer.states.create("hover");
labelContainer.events.on("hit", restoreContinents);

// ***************************************************
//  SUBJECT FILTER FUNCTION
function selectDataset(subject) {

  // Change data for bubble chart
  var selectedSubject = dsets[subject];
  var link = ["https://raw.githubusercontent.com/mcmaster-eng/standardized-citations/main/json/",selectedSubject,".json"].join('')
  var data_update = JSON.parse($.ajax({type: "GET", url: link, async: false}).responseText);
  chart.data = data_update;

  // Reset view as it may be zoomed in before changing subjects
  valueAxisX.start = 0;
  valueAxisX.end = 1;
  valueAxisX.keepSelection = true;

  /* adapter to disable bullets not related to the current subject
  bullet.adapter.add("disabled", function(disabled, target) {
     if (target.dataItem) {
       if (target.dataItem.id.includes(subject)){
         disabled = false;
       }
       else {
         disabled = true;
       }
       return disabled;
     }
  });*/

  chart.invalidateData();

  // Change data for map
  var selectedSubject_geo = geo_dsets[subject];
  var link = ["https://raw.githubusercontent.com/mcmaster-eng/standardized-citations/main/json/",selectedSubject_geo,".json"].join('')
  var data_update = JSON.parse($.ajax({type: "GET", url: link, async: false}).responseText);
  countriesSeries.data = data_update;
  chart_map.invalidateData();

}
