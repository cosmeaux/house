import {Component, OnInit} from 'angular2/core';
import * as core from 'angular2/core';
import {Http, Headers, HTTP_PROVIDERS} from 'angular2/http';
import {ChartDataService} from './ChartDataService';
import {Nvd3Component} from './Nvd3Component';


@Component({
    selector: 'chart',
    template: `
        <div class="{{uiCls}}-scrollbox" style="width: 100%; height: {{height}}px;">
            <nvd3-component [options]="chartOptions" [data]="data"></nvd3-component>
        </div>
    `,
    inputs: ['uiCls', 'height', 'nodes', 'url'],
    directives: [Nvd3Component],
    providers: [HTTP_PROVIDERS, ChartDataService]
})
export class Chart implements OnInit {
    data:Object[];
    height:Number;
    nodes:String[];
    url:String;
    uiCls:String;
    constructor(private chartDataService:ChartDataService) {
        this.data = [];
    }
    ngOnInit() {
        var me = this;
        this.chartDataService.request(this.url).subscribe((res:Response) => {
            var store = [];
            if (res.children && this.nodes.length) {
                this.nodes.map(function (node) {
                    var titleNodes = res.children.filter(function (child) {
                        return child.title == node;
                    });
                    if (titleNodes.length) {
                        titleNodes.map(function (titleNode) {
                            if (!titleNode.leaf) {
                                titleNode.children.map(function (child) {
                                    store.push(child);
                                });
                            }
                        }, store);
                    }
                }, store);
            }
            me.bind(store);
        });
    }
    bind(data) {
        var root = {
            key: this.nodes,
            values: []
        };
        data.sort(function (a, b) {
            return parseFloat(a.checking) - parseFloat(b.checking);
        });
        data.map(function (item) {
            var namePieces = item.name.split(' '),
                lastName = namePieces && namePieces.length > 1 ? namePieces[1].toUpperCase() : item.name.toUpperCase();
            root.values.push({
                "label": lastName,
                "color": parseFloat(item.checking) < 0 ? "red" : "green",
                "value": item.checking
            });
        }, root);
        this.data.push(root);
    }
    get chartOptions() {
        return {
            chart: {
                id: 'chart1',
                type: 'discreteBarChart',
                margin: {
                    top: 10,
                    right: 10,
                    bottom: 55,
                    left: 55
                },
                x: function (d) {
                    return d.label;
                },
                y: function (d) {
                    return d.value;
                },
                showValues: false,
                valueFormat: function (d) {
                    return d3.format(',.4f')(d);
                },
                duration: 150,
                rotateLabels: 45,
                showValues: false,
                showLegend: true,
                staggerLabels: true,
                xAxis: {
                    axisLabel: 'Account',
                },
                yAxis: {
                    axisLabel: 'Checking Balance',
                }
            }
        }
    }
}