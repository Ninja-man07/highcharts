/* *
 *
 *  (c) 2016-2020 Highsoft AS
 *
 *  Author: Lars A. V. Cabrera
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type AnimationOptionsObject from '../Core/Animation/AnimationOptionsObject';
import type ColorType from '../Core/Color/ColorType';
import type { SeriesStatesOptions } from '../Core/Series/SeriesOptions';
import type SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';
import type SVGPath from '../Core/Renderer/SVG/SVGPath';
import type XRangePoint from '../Series/XRange/XRangePoint';
import type {
    XRangePointOptions,
    XRangePointPartialFillOptions
} from '../Series/XRange/XRangePointOptions';
import type XRangeSeriesOptions from '../Series/XRange/XRangeSeriesOptions';
import BaseSeries from '../Core/Series/Series.js';
const {
    seriesTypes: {
        line: LineSeries,
        xrange: XRangeSeries
    }
} = BaseSeries;
import H from '../Core/Globals.js';
import '../Core/Axis/TreeGridAxis.js';
import U from '../Core/Utilities.js';
const {
    extend,
    isNumber,
    merge,
    pick,
    splat
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        type GanttDependencyOption =
            (
                string|
                GanttConnectorsOptions|
                Array<GanttConnectorsOptions>|
                Array<string>
            );
        class GanttPoint extends XRangePoint {
            public collapsed?: boolean;
            public end?: GanttPointOptions['end'];
            public milestone?: GanttPointOptions['milestone'];
            public options: GanttPointOptions;
            public series: GanttSeries;
            public start?: GanttPointOptions['start'];
            public applyOptions(
                options: GanttPointOptions,
                x: number
            ): GanttPoint;
            public isValid: () => boolean;
        }
        class GanttSeries extends XRangeSeries {
            public data: Array<GanttPoint>;
            public keyboardMoveVertical: boolean;
            public options: GanttSeriesOptions;
            public pointArrayMap: Array<string>;
            public pointClass: typeof GanttPoint;
            public points: Array<GanttPoint>;
            public drawPoint(point: GanttPoint, verb: string): void;
            public setGanttPointAliases(options: GanttPointOptions): void;
            public translatePoint(point: GanttPoint): void;
        }
        interface GanttAnimationOptionsObject extends Partial<AnimationOptionsObject> {
            reversed?: boolean;
        }
        interface GanttConnectorsOptions extends ConnectorsOptions {
            animation?: (boolean|GanttAnimationOptionsObject);
            startMarker?: GanttConnectorsStartMarkerOptions;
        }
        interface GanttConnectorsStartMarkerOptions
            extends ConnectorsStartMarkerOptions {
            fill: ColorType;
        }
        interface GanttPointOptions extends XRangePointOptions {
            completed?: (number|XRangePointPartialFillOptions);
            dependency?: (
                string|
                GanttConnectorsOptions|
                Array<GanttConnectorsOptions>|
                Array<string>
            );
            end?: number;
            milestone?: boolean;
            parent?: string;
            start?: number;
        }
        interface GanttSeriesOptions extends XRangeSeriesOptions {
            connectors?: GanttConnectorsOptions;
            states?: SeriesStatesOptions<GanttSeries>;
        }
    }
}

import '../Extensions/CurrentDateIndication.js';
import '../Extensions/StaticScale.js';
import '../Gantt/Pathfinder.js';

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.gantt
 *
 * @augments Highcharts.Series
 */
class GanttSeries extends XRangeSeries {

    /**
     * A `gantt` series. If the [type](#series.gantt.type) option is not specified,
     * it is inherited from [chart.type](#chart.type).
     *
     * @extends      plotOptions.xrange
     * @product      gantt
     * @requires     highcharts-gantt
     * @optionparent plotOptions.gantt
     */
    public static defaultOptions: Highcharts.GanttSeriesOptions = merge(XRangeSeries.defaultOptions, {
        // options - default options merged with parent

        grouping: false,

        dataLabels: {
            enabled: true
        },
        tooltip: {
            headerFormat:
                '<span style="font-size: 10px">{series.name}</span><br/>',
            pointFormat: null as any,
            pointFormatter: function (): string {
                var point: Highcharts.GanttPoint = this as any,
                    series = point.series,
                    tooltip = series.chart.tooltip,
                    xAxis = series.xAxis,
                    formats = series.tooltipOptions.dateTimeLabelFormats,
                    startOfWeek = xAxis.options.startOfWeek,
                    ttOptions = series.tooltipOptions,
                    format = ttOptions.xDateFormat,
                    start: string,
                    end: string,
                    milestone = point.options.milestone,
                    retVal = '<b>' + (point.name || point.yCategory) + '</b>';

                if (ttOptions.pointFormat) {
                    return point.tooltipFormatter(ttOptions.pointFormat);
                }

                if (!format) {
                    format = splat(
                        (tooltip as any).getDateFormat(
                            xAxis.closestPointRange,
                            point.start,
                            startOfWeek,
                            formats
                        )
                    )[0];
                }

                start = series.chart.time.dateFormat(format as any, point.start as any);
                end = series.chart.time.dateFormat(format as any, point.end as any);

                retVal += '<br/>';

                if (!milestone) {
                    retVal += 'Start: ' + start + '<br/>';
                    retVal += 'End: ' + end + '<br/>';
                } else {
                    retVal += start + '<br/>';
                }

                return retVal;
            }
        },
        connectors: {
            type: 'simpleConnect',
            /**
             * @declare Highcharts.ConnectorsAnimationOptionsObject
             */
            animation: {
                reversed: true // Dependencies go from child to parent
            },
            startMarker: {
                enabled: true,
                symbol: 'arrow-filled',
                radius: 4,
                fill: '#fa0',
                align: 'left' as 'left'
            },
            endMarker: {
                enabled: false, // Only show arrow on the dependent task
                align: 'right' as 'right'
            }
        }
    } as Highcharts.GanttSeriesOptions);

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<GanttPoint> = void 0 as any;

    public options: Highcharts.GanttSeriesOptions = void 0 as any;

    public points: Array<GanttPoint> = void 0 as any;

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface GanttSeries{
    keyboardMoveVertical: boolean;
    pointClass: typeof GanttPoint;
}
extend(GanttSeries.prototype, { // props - series member overrides

    // Keyboard navigation, don't use nearest vertical mode
    keyboardMoveVertical: false,

    pointArrayMap: ['start', 'end', 'y'],

    setData: LineSeries.prototype.setData,


    /* eslint-disable valid-jsdoc */

    /**
     * Handle milestones, as they have no x2.
     * @private
     */
    translatePoint: function (
        this: Highcharts.GanttSeries,
        point: Highcharts.GanttPoint
    ): void {
        var series = this,
            shapeArgs: SVGAttributes,
            size: number;

        XRangeSeries.prototype.translatePoint.call(series, point);

        if (point.options.milestone) {
            shapeArgs = point.shapeArgs as any;
            size = shapeArgs.height;
            point.shapeArgs = {
                x: shapeArgs.x - (size / 2),
                y: shapeArgs.y,
                width: size,
                height: size
            };
        }
    },

    /**
     * Draws a single point in the series.
     *
     * This override draws the point as a diamond if point.options.milestone
     * is true, and uses the original drawPoint() if it is false or not set.
     *
     * @requires highcharts-gantt
     *
     * @private
     * @function Highcharts.seriesTypes.gantt#drawPoint
     *
     * @param {Highcharts.Point} point
     *        An instance of Point in the series
     *
     * @param {"animate"|"attr"} verb
     *        'animate' (animates changes) or 'attr' (sets options)
     *
     * @return {void}
     */
    drawPoint: function (
        this: Highcharts.GanttSeries,
        point: Highcharts.GanttPoint,
        verb: string
    ): void {
        var series = this,
            seriesOpts = series.options,
            renderer = series.chart.renderer,
            shapeArgs: SVGAttributes = point.shapeArgs as any,
            plotY = point.plotY,
            graphic = point.graphic,
            state = point.selected && 'select',
            cutOff = seriesOpts.stacking && !seriesOpts.borderRadius,
            diamondShape: SVGPath;

        if (point.options.milestone) {
            if (isNumber(plotY) && point.y !== null && point.visible !== false) {
                diamondShape = renderer.symbols.diamond(
                    shapeArgs.x,
                    shapeArgs.y,
                    shapeArgs.width,
                    shapeArgs.height
                );

                if (graphic) {
                    graphic[verb]({
                        d: diamondShape
                    });
                } else {
                    point.graphic = graphic = renderer.path(diamondShape)
                        .addClass(point.getClassName(), true)
                        .add(point.group || series.group);
                }

                // Presentational
                if (!series.chart.styledMode) {
                    (point.graphic as any)
                        .attr(series.pointAttribs(point, state as any))
                        .shadow(seriesOpts.shadow, null, cutOff);
                }
            } else if (graphic) {
                point.graphic = graphic.destroy(); // #1269
            }
        } else {
            XRangeSeries.prototype.drawPoint.call(series, point, verb);
        }
    },

    /**
     * @private
     */
    setGanttPointAliases: function (
        this: Highcharts.GanttSeriesOptions,
        options: Highcharts.GanttPointOptions
    ): void {
        /**
         * Add a value to options if the value exists.
         * @private
         */
        function addIfExists(prop: string, val: unknown): void {
            if (typeof val !== 'undefined') {
                (options as any)[prop] = val;
            }
        }

        addIfExists('x', pick(options.start, options.x));
        addIfExists('x2', pick(options.end, options.x2));
        addIfExists(
            'partialFill', pick(options.completed, options.partialFill)
        );
    }

    /* eslint-enable valid-jsdoc */

});

/* *
 *
 *  Class
 *
 * */

class GanttPoint extends XRangeSeries.prototype.pointClass {

    /* *
     *
     *  Properties
     *
     * */

    public collapsed?: boolean;

    public end?: number;

    public milestone?: boolean;

    public options: Highcharts.GanttPointOptions = void 0 as any;

    public series: GanttSeries = void 0 as any;

    public start?: number;

}

/* *
 *
 *  Prototype Properties
 *
 * */

extend(GanttPoint.prototype, {
    // pointProps - point member overrides. We inherit from parent as well.

    /* eslint-disable valid-jsdoc */

    /**
     * Applies the options containing the x and y data and possible some
     * extra properties. This is called on point init or from point.update.
     *
     * @private
     * @function Highcharts.Point#applyOptions
     *
     * @param {object} options
     *        The point options
     *
     * @param {number} x
     *        The x value
     *
     * @return {Highcharts.Point}
     *         The Point instance
     */
    applyOptions: function (
        this: Highcharts.GanttPoint,
        options: Highcharts.GanttPointOptions,
        x: number
    ): Highcharts.GanttPoint {
        var point = this,
            ganttPoint;

        ganttPoint = XRangeSeries.prototype.pointClass.prototype.applyOptions
            .call(point, options, x) as Highcharts.GanttPoint;
        H.seriesTypes.gantt.prototype.setGanttPointAliases(ganttPoint as Highcharts.GanttPointOptions);

        return ganttPoint;
    },
    isValid: function (this: Highcharts.GanttPoint): boolean {
        return (
            (
                typeof this.start === 'number' ||
                typeof this.x === 'number'
            ) &&
            (
                typeof this.end === 'number' ||
                typeof this.x2 === 'number' ||
                (this.milestone as any)
            )
        );
    }

    /* eslint-enable valid-jsdoc */

});

/* *
 *
 *  Registry
 *
 * */

declare module '../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        gantt: typeof Highcharts.GanttSeries;
    }
}
GanttSeries.prototype.pointClass = GanttPoint;
BaseSeries.registerSeriesType('gantt', GanttSeries);

/* *
 *
 *  Default Export
 *
 * */

export default GanttSeries;

/* *
 *
 *  API Options
 *
 * */

/**
 * A `gantt` series.
 *
 * @extends   series,plotOptions.gantt
 * @excluding boostThreshold, connectors, dashStyle, findNearestPointBy,
 *            getExtremesFromAll, marker, negativeColor, pointInterval,
 *            pointIntervalUnit, pointPlacement, pointStart
 * @product   gantt
 * @requires  highcharts-gantt
 * @apioption series.gantt
 */

/**
 * Data for a Gantt series.
 *
 * @declare   Highcharts.GanttPointOptionsObject
 * @type      {Array<*>}
 * @extends   series.xrange.data
 * @excluding className, color, colorIndex, connect, dataLabels, events,
 *            partialFill, selected, x, x2
 * @product   gantt
 * @apioption series.gantt.data
 */

/**
 * Whether the grid node belonging to this point should start as collapsed. Used
 * in axes of type treegrid.
 *
 * @sample {gantt} gantt/treegrid-axis/collapsed/
 *         Start as collapsed
 *
 * @type      {boolean}
 * @default   false
 * @product   gantt
 * @apioption series.gantt.data.collapsed
 */

/**
 * The start time of a task.
 *
 * @type      {number}
 * @product   gantt
 * @apioption series.gantt.data.start
 */

/**
 * The end time of a task.
 *
 * @type      {number}
 * @product   gantt
 * @apioption series.gantt.data.end
 */

/**
 * The Y value of a task.
 *
 * @type      {number}
 * @product   gantt
 * @apioption series.gantt.data.y
 */

/**
 * The name of a task. If a `treegrid` y-axis is used (default in Gantt charts),
 * this will be picked up automatically, and used to calculate the y-value.
 *
 * @type      {string}
 * @product   gantt
 * @apioption series.gantt.data.name
 */

/**
 * Progress indicator, how much of the task completed. If it is a number, the
 * `fill` will be applied automatically.
 *
 * @sample {gantt} gantt/demo/progress-indicator
 *         Progress indicator
 *
 * @type      {number|*}
 * @extends   series.xrange.data.partialFill
 * @product   gantt
 * @apioption series.gantt.data.completed
 */

/**
 * The amount of the progress indicator, ranging from 0 (not started) to 1
 * (finished).
 *
 * @type      {number}
 * @default   0
 * @apioption series.gantt.data.completed.amount
 */

/**
 * The fill of the progress indicator. Defaults to a darkened variety of the
 * main color.
 *
 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @apioption series.gantt.data.completed.fill
 */

/**
 * The ID of the point (task) that this point depends on in Gantt charts.
 * Aliases [connect](series.xrange.data.connect). Can also be an object,
 * specifying further connecting [options](series.gantt.connectors) between the
 * points. Multiple connections can be specified by providing an array.
 *
 * @sample gantt/demo/project-management
 *         Dependencies
 * @sample gantt/pathfinder/demo
 *         Different connection types
 *
 * @type      {string|Array<string|*>|*}
 * @extends   series.xrange.data.connect
 * @since     6.2.0
 * @product   gantt
 * @apioption series.gantt.data.dependency
 */

/**
 * Whether this point is a milestone. If so, only the `start` option is handled,
 * while `end` is ignored.
 *
 * @sample gantt/gantt/milestones
 *         Milestones
 *
 * @type      {boolean}
 * @since     6.2.0
 * @product   gantt
 * @apioption series.gantt.data.milestone
 */

/**
 * The ID of the parent point (task) of this point in Gantt charts.
 *
 * @sample gantt/demo/subtasks
 *         Gantt chart with subtasks
 *
 * @type      {string}
 * @since     6.2.0
 * @product   gantt
 * @apioption series.gantt.data.parent
 */

/**
 * @excluding afterAnimate
 * @apioption series.gantt.events
 */

''; // adds doclets above to the transpiled file
