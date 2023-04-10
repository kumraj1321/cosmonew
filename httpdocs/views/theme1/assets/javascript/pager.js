$(document).ready(function () {
     var baseUrl = '/api/';

     // var customerTable = new ({
     //      tableId: 'CustomerTable',
     //      totalItemsAttribute: 'ctTotalItems',
     //      page: 1,
     //      pageSize: 5,
     //      pagerSizeOptions: [[ 5, 10, 25, -1 ], [ 5, 10, 25, 'All' ]],    
     //      sortColumn: 'Id',
     //      sortDirection: 'asc',
     //      columnHeaderClass: 'colHeaders',
     //      showFilter: true,
     //      spinnerSource: '/images/spinner-128.gif'
     // });

     // customerTable.setDataBinding(CustomerList);

     $('#refresh').click(function () {
          CustomerList(customerTable.getPage(), customerTable.getPageSize(), customerTable.getSortColumn(), customerTable.getSortDirection(), customerTable.getFilterColumn(), customerTable.getFilterValue());
     });

     function CustomerList(page, pageSize, sortColumn, direction, filterColumn, filterValue) {
        var delay = 1000;
        var requestString = '?page=' + page + '&pageSize=' + pageSize + '&sortColumn=' + sortColumn + '&direction=' + direction + '&filterColumn=' + filterColumn + '&filterValue=' + filterValue;
        var url = baseUrl + 'customer/' + requestString;
        var gridBodyId = 'CustomerList';
        var template = 'customerListHGrid';
        //simulate network delay
        setTimeout(function () {
             ajaxGet({
                  url: url,
                  success: function (result) {
                       jsonresult = result;
                       if (parseInt(result.totalItems, 10) > 0)
                            bindGrid(gridBodyId, template, result.customers);
                       else
                            bindNoRecords(gridBodyId);
                       customerTable.endDataBinding(result.totalItems);

                  },
                  error: function (result, status, xhr) {
                       bindNoRecords(gridBodyId);
                       customerTable.endDataBinding(0);                  }
             });
        }, delay);
        
    }

    function bindGrid(grid, src, data, appendTo) {
        var result = '{"' + grid + '":' + JSON.stringify(data) + "}";
        var source = $('#' + src).html();
        var template = Handlebars.compile(source);
        var html = template(JSON.parse(result));
        $("#" + appendTo).html(html);
     }

    function bindNoRecords(grid) {
         var html = '<tr id="noRecordsFound"><td class="lead text-left text-danger" colspan= "4">No Records Found!</td></tr>';
         $("#" + grid).html(html);
    }
});