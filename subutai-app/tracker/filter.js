/**
 * Created by akubatbekk on 7/1/15.
 */
'use strict';

angular.module('subutai.tracker.filter', [])
    .filter('dateRange', dateRange)
    .filter('toStringFilter', toStringFilter);

function dateRange() {
    return function(input, startDate, endDate) {
        angular.forEach(input, function(obj){
            if(obj.date >= startDate.getTime() && obj.date <= endDate.getTime())   {
                return obj;
            }
        });
    };
}

function toStringFilter() {
    return function(input) {
        var date = new Date(input);
        return date.toDateString();
    }
}