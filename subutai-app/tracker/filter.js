/**
 * Created by akubatbekk on 7/1/15.
 */
'use strict';

angular.module('subutai.tracker.filter', [])
    .filter('dateRange', dateRange);

function dateRange() {
    return function(input, startDate, endDate) {
        angular.forEach(input, function(obj){
            if(obj.date >= startDate.getTime() && obj.date <= endDate.getTime())   {
                return obj;
            }
        });
        return input;
    };
}
