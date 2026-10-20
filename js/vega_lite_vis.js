
/* ==========================================
   AUSTRALIA'S PROTECTED PLACES
   FIT3179 DV2 — ALL SIX VISUALISATIONS
========================================== */

const chartTheme = {
  background: null,
  view: { stroke: null },
  font: "Arial",
  axis: {
    labelFontSize: 10,
    titleFontSize: 11,
    labelColor: "#36513f",
    titleColor: "#214e34",
    gridColor: "#e6ebe5"
  },
  legend: {
    labelFontSize: 10,
    titleFontSize: 11,
    labelColor: "#36513f",
    titleColor: "#214e34"
  }
};

function showChart(selector, spec) {
  vegaEmbed(selector, spec, {
    actions: false,
    renderer: "svg"
  }).catch(function(error) {
    console.error("Error loading " + selector, error);
  });
}

/* ==========================================
   CHART 1 — PROTECTED LAND BY STATE
========================================== */

var stateBarChart = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": 340,
  "height": 310,

  "data": {
    "url": "data/state_protection.csv"
  },

  "mark": {
    "type": "bar",
    "color": "#4F8B62",
    "cornerRadiusEnd": 4
  },

  "encoding": {
    "y": {
      "field": "jurisdiction",
      "type": "nominal",
      "sort": "-x",
      "title": null,
      "axis": {
        "labelFontSize": 11
      }
    },

    "x": {
      "field": "percent_protected",
      "type": "quantitative",
      "title": "Protected land (%)",
      "scale": {
        "domain": [0, 60]
      }
    },

    "tooltip": [
      {
        "field": "jurisdiction",
        "type": "nominal",
        "title": "State/Territory"
      },
      {
        "field": "percent_protected",
        "type": "quantitative",
        "title": "Protected (%)",
        "format": ".2f"
      },
      {
        "field": "protected_area_count",
        "type": "quantitative",
        "title": "Protected Areas",
        "format": ","
      }
    ]
  },

  "config": chartTheme
};

showChart("#state-bar-chart", stateBarChart);


/* ==========================================
   CHART 2 — PROTECTED LAND CHOROPLETH
========================================== */

var stateMap = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": 350,
  "height": 310,

  "data": {
    "url": "data/australia_states.geojson",
    "format": {
      "type": "json",
      "property": "features"
    }
  },

  "transform": [
    {
      "calculate": "upper(datum.properties.code)",
      "as": "jurisdiction"
    },
    {
      "lookup": "jurisdiction",
      "from": {
        "data": {
          "url": "data/state_protection.csv"
        },
        "key": "jurisdiction",
        "fields": [
          "percent_protected",
          "protected_area_count"
        ]
      }
    }
  ],

  "projection": {
    "type": "mercator",
    "center": [134, -28],
    "scale": 355,
    "translate": [175, 155]
  },

  "mark": {
    "type": "geoshape",
    "stroke": "#ffffff",
    "strokeWidth": 1
  },

  "encoding": {
    "shape": {
      "field": "geometry",
      "type": "geojson"
    },

    "color": {
      "field": "percent_protected",
      "type": "quantitative",
      "title": "Protected (%)",
      "scale": {
        "scheme": "greens"
      },
      "legend": {
        "orient": "bottom",
        "direction": "horizontal",
        "gradientLength": 180
      }
    },

    "tooltip": [
      {
        "field": "properties.name",
        "type": "nominal",
        "title": "State/Territory"
      },
      {
        "field": "percent_protected",
        "type": "quantitative",
        "title": "Protected (%)",
        "format": ".2f"
      },
      {
        "field": "protected_area_count",
        "type": "quantitative",
        "title": "Protected Areas",
        "format": ","
      }
    ]
  },

  "config": chartTheme
};

showChart("#state-map", stateMap);


/* ==========================================
   CHART 3 — THREATENED SPECIES SYMBOL MAP
========================================== */

var threatenedSpeciesMap = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": 350,
  "height": 310,

  "projection": {
    "type": "mercator",
    "center": [134, -28],
    "scale": 355,
    "translate": [175, 155]
  },

  "layer": [
    {
      "data": {
        "url": "data/australia_states.geojson",
        "format": {
          "type": "json",
          "property": "features"
        }
      },

      "mark": {
        "type": "geoshape",
        "fill": "#e7ede6",
        "stroke": "#ffffff",
        "strokeWidth": 1
      },

      "encoding": {
        "shape": {
          "field": "geometry",
          "type": "geojson"
        }
      }
    },

    {
      "data": {
        "url": "data/threatened_species_grid.csv"
      },

      "mark": {
        "type": "circle",
        "opacity": 0.65
      },

      "encoding": {
        "longitude": {
          "field": "longitude",
          "type": "quantitative"
        },

        "latitude": {
          "field": "latitude",
          "type": "quantitative"
        },

        "size": {
          "field": "occurrence_count",
          "type": "quantitative",
          "title": "Observations",
          "scale": {
            "range": [5, 180]
          },
          "legend": {
            "orient": "bottom",
            "direction": "horizontal"
          }
        },

        "color": {
          "field": "status",
          "type": "nominal",
          "title": "Threat status",
          "scale": {
            "domain": [
              "Vulnerable",
              "Endangered",
              "Critically Endangered"
            ],
            "range": [
              "#e6ae51",
              "#ce7152",
              "#873e58"
            ]
          },
          "legend": {
            "orient": "bottom",
            "direction": "horizontal",
            "columns": 2
          }
        },

        "tooltip": [
          {
            "field": "status",
            "type": "nominal",
            "title": "Status"
          },
          {
            "field": "occurrence_count",
            "type": "quantitative",
            "title": "Observations",
            "format": ","
          },
          {
            "field": "latitude",
            "type": "quantitative",
            "title": "Latitude",
            "format": ".2f"
          },
          {
            "field": "longitude",
            "type": "quantitative",
            "title": "Longitude",
            "format": ".2f"
          }
        ]
      }
    }
  ],

  "config": chartTheme
};

showChart("#threatened-species-map", threatenedSpeciesMap);


/* ==========================================
   CHART 4 — THREAT STATUS HEATMAP
========================================== */

var threatStatusHeatmap = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": 310,
  "height": 300,

  "data": {
    "url": "data/threatened_species_state_status.csv"
  },

  "mark": {
    "type": "rect",
    "stroke": "#ffffff",
    "strokeWidth": 2,
    "cornerRadius": 3
  },

  "encoding": {
    "x": {
      "field": "status",
      "type": "nominal",
      "title": null,
      "sort": [
        "Vulnerable",
        "Endangered",
        "Critically Endangered"
      ],
      "axis": {
        "labelAngle": -25,
        "labelFontSize": 9,
        "labelLimit": 120
      }
    },

    "y": {
      "field": "state",
      "type": "nominal",
      "title": null,
      "sort": [
        "NSW",
        "VIC",
        "QLD",
        "WA",
        "SA",
        "TAS",
        "NT",
        "ACT"
      ]
    },

    "color": {
      "field": "occurrence_count",
      "type": "quantitative",
      "title": "Observations",
      "scale": {
        "scheme": "yellowgreenblue"
      },
      "legend": {
        "orient": "bottom",
        "direction": "horizontal",
        "gradientLength": 180
      }
    },

    "tooltip": [
      {
        "field": "state",
        "type": "nominal",
        "title": "State/Territory"
      },
      {
        "field": "status",
        "type": "nominal",
        "title": "Conservation Status"
      },
      {
        "field": "occurrence_count",
        "type": "quantitative",
        "title": "Observations",
        "format": ","
      }
    ]
  },

  "config": chartTheme
};

showChart("#threat-status-heatmap", threatStatusHeatmap);


/* ==========================================
   CHART 5 — PROTECTED AREA GROWTH
========================================== */

var protectedGrowthChart = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": 335,
  "height": 300,

  "data": {
    "url": "data/protected_area_growth.csv"
  },

  "transform": [
    {
      "calculate": "format(datum.percent_protected, '.1f') + '%'",
      "as": "percent_label"
    }
  ],

  "encoding": {
    "x": {
      "field": "year",
      "type": "quantitative",
      "title": "CAPAD edition",
      "scale": {
        "domain": [2001, 2025]
      },
      "axis": {
        "format": "d",
        "values": [2002, 2008, 2014, 2022, 2024],
        "labelAngle": -30
      }
    },

    "y": {
      "field": "percent_protected",
      "type": "quantitative",
      "title": "Protected land (%)",
      "scale": {
        "domain": [0, 32]
      }
    }
  },

  "layer": [
    {
      "mark": {
        "type": "area",
        "color": "#8fb59b",
        "opacity": 0.25
      }
    },

    {
      "mark": {
        "type": "line",
        "color": "#214e34",
        "strokeWidth": 3
      }
    },

    {
      "mark": {
        "type": "point",
        "filled": true,
        "color": "#214e34",
        "size": 85,
        "stroke": "white",
        "strokeWidth": 1.5
      },

      "encoding": {
        "tooltip": [
          {
            "field": "year",
            "type": "quantitative",
            "title": "CAPAD Edition",
            "format": "d"
          },
          {
            "field": "percent_protected",
            "type": "quantitative",
            "title": "Protected (%)",
            "format": ".2f"
          },
          {
            "field": "protected_area_million_ha",
            "type": "quantitative",
            "title": "Protected area (million ha)",
            "format": ".1f"
          }
        ]
      }
    },

    {
      "mark": {
        "type": "text",
        "dy": -13,
        "fontSize": 10,
        "fontWeight": "bold",
        "color": "#214e34"
      },

      "encoding": {
        "text": {
          "field": "percent_label"
        }
      }
    },

    {
      "data": {
        "values": [
          { "target": 30 }
        ]
      },

      "mark": {
        "type": "rule",
        "strokeDash": [5, 5],
        "strokeWidth": 2,
        "color": "#8b5e3c"
      },

      "encoding": {
        "y": {
          "field": "target",
          "type": "quantitative"
        }
      }
    },

    {
      "data": {
        "values": [
          {
            "year": 2002,
            "target": 30,
            "label": "30% target"
          }
        ]
      },

      "mark": {
        "type": "text",
        "align": "left",
        "dx": 5,
        "dy": -8,
        "fontSize": 10,
        "fontWeight": "bold",
        "color": "#8b5e3c"
      },

      "encoding": {
        "x": {
          "field": "year",
          "type": "quantitative"
        },
        "y": {
          "field": "target",
          "type": "quantitative"
        },
        "text": {
          "field": "label"
        }
      }
    }
  ],

  "config": chartTheme
};

showChart("#protected-growth-chart", protectedGrowthChart);


/* ==========================================
   CHART 6 — DORLING-STYLE CARTOGRAM
========================================== */

var dorlingCartogram = {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": 420,
  "height": 330,

  "data": {
    "url": "data/threatened_species_state_status.csv",
    "format": {
      "type": "csv",
      "parse": {
        "occurrence_count": "number"
      }
    }
  },

  "transform": [
    {
      "aggregate": [
        {
          "op": "sum",
          "field": "occurrence_count",
          "as": "total_observations"
        }
      ],
      "groupby": ["state"]
    },

    {
      "lookup": "state",
      "from": {
        "data": {
          "url": "data/state_protection.csv",
          "format": {
            "type": "csv",
            "parse": {
              "percent_protected": "number"
            }
          }
        },
        "key": "jurisdiction",
        "fields": ["percent_protected"]
      }
    },

    {
      "calculate": "datum.state == 'WA' ? 1 : datum.state == 'NT' ? 3 : datum.state == 'SA' ? 3.2 : datum.state == 'QLD' ? 5.5 : datum.state == 'NSW' ? 5.8 : datum.state == 'VIC' ? 5 : datum.state == 'TAS' ? 5.8 : 7",
      "as": "xpos"
    },

    {
      "calculate": "datum.state == 'WA' ? 3 : datum.state == 'NT' ? 1.2 : datum.state == 'SA' ? 3.8 : datum.state == 'QLD' ? 1.5 : datum.state == 'NSW' ? 3.5 : datum.state == 'VIC' ? 5.6 : datum.state == 'TAS' ? 7.2 : 4.5",
      "as": "ypos"
    }
  ],

  "encoding": {
    "x": {
      "field": "xpos",
      "type": "quantitative",
      "axis": null,
      "scale": {
        "domain": [-1, 9]
      }
    },

    "y": {
      "field": "ypos",
      "type": "quantitative",
      "axis": null,
      "scale": {
        "domain": [-1, 9],
        "reverse": true
      }
    }
  },

  "layer": [
    {
      "mark": {
        "type": "circle",
        "opacity": 0.95,
        "stroke": "#ffffff",
        "strokeWidth": 1.5
      },

      "encoding": {
        "size": {
          "field": "total_observations",
          "type": "quantitative",
          "title": "ALA observations",
          "scale": {
            "range": [350, 4500]
          },
          "legend": {
            "orient": "bottom",
            "direction": "horizontal",
            "symbolCount": 3
          }
        },

        "color": {
          "field": "percent_protected",
          "type": "quantitative",
          "title": "Protected land (%)",
          "scale": {
            "domain": [0, 60],
            "scheme": "greens"
          },
          "legend": {
            "orient": "bottom",
            "direction": "horizontal",
            "gradientLength": 180
          }
        },

        "tooltip": [
          {
            "field": "state",
            "type": "nominal",
            "title": "State/Territory"
          },
          {
            "field": "total_observations",
            "type": "quantitative",
            "title": "ALA observations",
            "format": ","
          },
          {
            "field": "percent_protected",
            "type": "quantitative",
            "title": "Protected land (%)",
            "format": ".1f"
          }
        ]
      }
    },

    {
      "mark": {
        "type": "text",
        "fontSize": 11,
        "fontWeight": "bold",
        "color": "#173b2a"
      },

      "encoding": {
        "text": {
          "field": "state",
          "type": "nominal"
        }
      }
    }
  ],

  "config": chartTheme
};

showChart("#bivariate-map", dorlingCartogram);
