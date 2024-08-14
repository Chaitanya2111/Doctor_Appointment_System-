import React from "react";
import PropTypes from 'prop-types'; 
import NVD3Chart from 'react-nvd3';
function chart() {
    
    const data = getDatum();

    function getDatum() {
        var sin = [],
          sin2 = [],
          cos = [];
        for (var i = 0; i < 100; i++) {
          sin.push({
            x: i,
            y: Math.sin(i / 10)
          });
          sin2.push({
            x: i,
            y: Math.sin(i / 10) * 0.25 + 0.5
          });
          cos.push({
            x: i,
            y: 0.5 * Math.cos(i / 10)
          });
        }
        return [
          {
            values: sin,
            key: 'Sine Wave',
            color: '#A389D4'
          },
          {
            values: cos,
            key: 'Cosine Wave',
            color: '#04a9f5'
          },
          {
            values: sin2,
            key: 'Another sine wave',
            color: '#1de9b6',
            area: true
          }
        ];
      }

    const patientsData = [
        {
          values: data[0].values.map(({ x, y }) => ({ x, y: y * 1.15 })), // Increase by 15%
          key: 'Patients',
          color: '#04a9f5'
        }
      ];

      const LineChart = ({ title, data }) => {
        return (
          <React.Fragment>
            <h3 className="mb-4">{title}</h3>
            {React.createElement(NVD3Chart, {
              xAxis: {
                tickFormat: function (d) {
                  return d;
                },
                axisLabel: 'Time (ms)'
              },
              yAxis: {
                axisLabel: 'Value',
                tickFormat: function (d) {
                  return parseFloat(d).toFixed(2);
                }
              },
              type: 'lineChart',
              datum: data,
              x: 'x',
              y: 'y',
              height: 200,
              renderEnd: function () {
                console.log('renderEnd');
              }
            })}
          </React.Fragment>
        );
      };
      
      LineChart.propTypes = {
        title: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired,
      };
      

    return (

     
                    <div className="">
                    <LineChart title="Patients Total (15% Higher)" data={patientsData}  />
                    </div>
                
        
    );
}

export default chart;