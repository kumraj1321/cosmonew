//
//Copyright (c) Seagull Consulting, Inc. All rights reserved. See License.txt in the project root for license information.
//
//Version 0.9.1
//
//Public methods:
//   setDataBinding(function)
//   endDataBinding(totalItems)
//   getPage()
//   getPageSize()
//   getSortColumn()
//   getSortDirection()
//   showSpinner(show)
//
//Private methods:
//   CreateFilterRow(tableId)
//   CreatePagingControls(tableId)
//   EnableRowSorting(tableId)
//   FirstPage(event)
//   PreviousPage(event)
//   NextPage(event)
//   LastPage(event)
//   UpdatePagerControls()
//   ShowTableInfo()
//   FilterTable()
//   ProcessSortEvent(id)
//   ToggleFilterRow()
//   CreateAnchorElement(options)
//   CreateLabelElement(options)
//   CreateButtonElement(options)

//Define constructor for TurboTables Library
function TurboTablesLib(options) {


     //register the instance
     if (options.tableId )
         this.tableId = options.tableId;
     else
          throw 'NextPage Library requires the Table Id to run!';

     //Create locally scoped variables ($this)
     this.page = 1;
     this.pageSize = 10;
     this.pagerSizeOptions = [];
     this.sortColumn = 'Id';
     this.sortDirection = 'asc';
     this.filterColumn = '';
     this.filterValue = '';
     this.searchPropertyValue;
     this.columnHeaderClass = 'colHeaders';
     this.spinnerSource = '/images/spinner.gif';
     this.totalItemsAttribute = '';
     this.totalItems = 0;
     this.tableInfoId = 'showing';
     this.showFilter = false;
     this.filterId = 'filter';
     this.filterIconId = 'filterIcon';
     this.filterValueInputId = 'filterValueInput';
     this.clearFilterButtonId = 'clearFilterButtonId';
     this.filterFilterButtonId = 'filterFilterButtonId';
     this.selectFilterColumnId = 'filterSelectColumn';
     this.searchInputId = 'search';
     this.selectPgSizerId = 'pageSize';
     this.tableInfoTemplate = 'Showing {0} to {1} of {2} entries';
     this.firstButtonId = 'first';
     this.prevButtonId = 'prev';
     this.nextButtonId = 'next';
     this.lastButtonId = 'last';
     this.jumpButtonId = 'jump';
     this.jumpInputId = 'jumpInput';
     this.spinnerId = 'spinner';
     this.dataBinder = function () { };

     if (options) {
          if (options.page)
               this.page = options.page;
          if (options.pageSize)
               this.pageSize = options.pageSize;
          if (options.pagerSizeOptions)
               this.pagerSizeOptions = options.pagerSizeOptions;
          if (options.sortColumn)
               this.sortColumn = options.sortColumn;
          if (options.sortDirection)
               this.sortDirection = options.sortDirection;
          if (options.columnHeaderClass)
               this.columnHeaderClass = options.columnHeaderClass;
          if (options.showFilter)
               this.showFilter = options.showFilter;
          if (options.spinnerSource)
               this.spinnerSource = options.spinnerSource;
          if (options.totalItemsAttribute)
               this.totalItemsAttribute = options.totalItemsAttribute;
     }

     //Retrieve total items from table (perhaps needs more error checking)
     this.totalItems = parseInt(document.getElementById(this.tableId).getAttribute(this.totalItemsAttribute), 10);

     //Add Showing, Search, and Filter row and functionality
     this.CreateSearchAndFilterRows(this.tableId);

     //Add Paging controls and PageSizer control
     this.CreatePagingControls(this.tableId);

     //Hook events for row sorting
     this.EnableColumnSortingAndFiltering(this.tableId);

     //Add spinner
     this.AddSpinner(this.tableId);

     //enableRowSorting();
     this.ShowTableInfo();

     return this;
};

TurboTablesLib.prototype.setDataBinding = function (dataBinder) {
     //Call data binding
     this.dataBinder = dataBinder;
     return this;
};

TurboTablesLib.prototype.endDataBinding = function (totalItems) {
     this.totalItems = totalItems;
     document.getElementById(this.tableId).setAttribute(this.totalItemsAttribute, this.totalItems);
     this.ShowTableInfo();
     //Stop the spinner
     this.showSpinner(false);
};

TurboTablesLib.prototype.getPage = function () {
     return this.page;
};

TurboTablesLib.prototype.getPageSize = function () {
     return this.pageSize;
};


TurboTablesLib.prototype.getSortColumn = function () {
     return this.sortColumn;
};

TurboTablesLib.prototype.getSortDirection = function () {
     return this.sortDirection;
};

TurboTablesLib.prototype.getFilterColumn = function () {
     var filterSelectElem = document.getElementById(this.selectFilterColumnId);
     this.filterColumn = filterSelectElem.options[filterSelectElem.selectedIndex].value;

     return this.filterColumn;
};

TurboTablesLib.prototype.getFilterValue = function () {
     this.filterValue = document.getElementById(this.filterValueInputId).value;
     return this.filterValue;
};

//Show / Hide waiting data spinner
TurboTablesLib.prototype.showSpinner = function (show) {
     if (show)
          document.getElementById(this.spinnerId).style.display = 'block';
     else
          document.getElementById(this.spinnerId).style.display = 'none';

};
//Create 'private' Helper functions

//Create the Search and Filter Row elements (Table info, search input, and filter input) above the table
TurboTablesLib.prototype.CreateSearchAndFilterRows = function (tableId) {

     //Create elements in the search row
     var searchNode = document.createElement('div'); searchNode.className = 'row';

     var infoNode = document.createElement('div'); infoNode.className = 'col-sm-4';
     if (this.showFilter) {
          var filterIconNode = this.CreateElement({ type: 'a', id: this.filterIconId, href: '#', html: '<i class="fa fa-filter fa-2x"></i>' });
          infoNode.appendChild(filterIconNode);
     }
     var showingLabelNode = this.CreateElement({ type: 'label', className: 'col-sm-10', id: this.tableInfoId, html: this.tableInfoTemplate });
     infoNode.appendChild(showingLabelNode);
     searchNode.appendChild(infoNode);

     var formNode = this.CreateElement({ type: 'form', className: 'col-sm-8', action: '#' });
     var formGroupNode = document.createElement('div'); formGroupNode.className = 'form-group row float-right';
     var inputGroupNode = document.createElement('div'); inputGroupNode.className = 'input-group mb-3';
     var searchInputNode = this.CreateElement({ type: 'input', className: 'form-control-sm', id: this.searchInputId, inputType: 'search', placeholder: 'Search' });

     inputGroupNode.appendChild(searchInputNode);
     formGroupNode.appendChild(inputGroupNode);
     formNode.appendChild(formGroupNode);

     searchNode.appendChild(formNode);
     var insertPosition = document.getElementById(tableId).parentNode.parentNode;
     insertPosition.parentNode.insertBefore(searchNode, insertPosition);

     var self = this;
     if (this.showFilter) {
          //Hook events for filter icon
          filterIconNode.addEventListener("click", function () {
               self.ToggleFilterRow();
          });
     }

     //Hook events for search
     searchInputNode.addEventListener("keyup", function () {
          self.SearchTable();
     });
     searchInputNode.onmouseover = function () {
          searchInputNode.setAttribute('cursor', 'pointer');
     };
     searchInputNode.onmouseleave = function () {
          searchInputNode.setAttribute('cursor', 'auto');
     };

     if (this.showFilter) {
          //
          //Create elements in the filter row
          var filterNode = document.createElement('div'); filterNode.className = 'row';
          filterNode.id = this.filterId; filterNode.style.display = 'none';

          //Create Column Select
          var filterColumnFormGroup = document.createElement('div'); filterColumnFormGroup.className = 'form-group col-sm-3';
          var filterColumnSelect = document.createElement('select'); filterColumnSelect.className = 'form-control'; filterColumnSelect.id = this.selectFilterColumnId;
          filterColumnFormGroup.appendChild(filterColumnSelect);

          //Create Column Value
          var filterInputFormGroupNode = document.createElement('div'); filterInputFormGroupNode.className = 'form-group row col-sm-3';
          var filterInputGroupNode = document.createElement('div'); filterInputGroupNode.className = 'input-group col-sm-12';
          var filterValueInputNode = this.CreateElement({ type: 'input', className: 'form-control col-sm-12', id: this.filterValueInputId, placeholder: 'Value', inputType: 'text' });
          filterInputGroupNode.appendChild(filterValueInputNode);
          filterInputFormGroupNode.appendChild(filterInputGroupNode);

          //Create Clear and Filter buttons
          var filterButtonGroup = document.createElement('div'); filterButtonGroup.className = 'filter-grp col-sm-4';
          var clearFilterButtonNode = this.CreateElement({ type: 'a', className: 'btn btn-primary', id: this.clearFilterButtonId, html: 'Clear', href: '#' });
          var filterFilterButtonNode = this.CreateElement({ type: 'a', className: 'btn btn-primary', id: this.filterFilterButtonId, html: 'Filter', href: '#' });
          filterButtonGroup.appendChild(clearFilterButtonNode); filterButtonGroup.appendChild(filterFilterButtonNode);

          filterNode.appendChild(filterColumnFormGroup);
          filterNode.appendChild(filterInputFormGroupNode);
          filterNode.appendChild(filterButtonGroup);

          insertPosition = document.getElementById(tableId).parentNode.parentNode;
          insertPosition.parentNode.insertBefore(filterNode, insertPosition);

          //Hook events for filter
          filterFilterButtonNode.addEventListener('click', function () { self.FilterQuery(); });
          clearFilterButtonNode.addEventListener('click', function () { self.ClearFilterQuery(); });
     }

};

//Add the Spinner element above the table
TurboTablesLib.prototype.AddSpinner = function (tableId) {

     //Create spinner elements
     var spinnerNode = document.createElement('div');
     spinnerNode.className = 'spinner';
     spinnerNode.id = this.spinnerId;
     var spinnerImageNode = document.createElement('img');
     spinnerImageNode.className = 'img-responsive center-block';
     spinnerImageNode.setAttribute('src', this.spinnerSource);
     spinnerImageNode.setAttribute('alt', "Loading...");

     //Insert spinner above table
     spinnerNode.appendChild(spinnerImageNode);
     var insertPosition = document.getElementById(tableId).parentNode.parentNode;
     insertPosition.parentNode.insertBefore(spinnerNode, insertPosition);
};

TurboTablesLib.prototype.EnableColumnSortingAndFiltering = function (tableId) {
     //throw 'Not implemented exception';
     var self = this;

     if (this.showFilter) {
          //Initialize the filter column select list
          var selectColumnNode = document.getElementById(this.selectFilterColumnId);
          var option = document.createElement('option');
          option.text = 'Select a column';
          option.value = '';
          option.setAttribute('disabled', 'true'); option.setAttribute('selected', 'true');
          selectColumnNode.appendChild(option);
     }

     //Discover the header columns and add event listeners to them
     var thead = document.getElementById(tableId).getElementsByTagName('thead');
     var colRows = thead[0].getElementsByTagName('tr');
     var colHeaders = colRows[0].getElementsByTagName('th');

     for (var idx = 0; idx < colHeaders.length; idx++) {
          //If sorting specified for the column, then hook the click event
          if (colHeaders[idx].className.indexOf('sortable') !== -1) {
               colHeaders[idx].addEventListener('click', function () {
                    self.ProcessSortEvent(this.id);
               });
          };

          if (this.showFilter) {
               // If the column / field is filterable, then add to the select list
               if (colHeaders[idx].className.indexOf('filterable') !== -1) {
                    option = document.createElement('option'); option.text = colHeaders[idx].id;
                    selectColumnNode.appendChild(option);
               }
          }

     };
};

//Create the Paging controls (first, previous, jump, next, last) and Page Sizer dropdown list
TurboTablesLib.prototype.CreatePagingControls = function (tableId) {

     //Create elements in the paging controls row
     var pagingCtrlNode = document.createElement('div'); pagingCtrlNode.className = 'row';

     //Create table-pager control button group
     var bgColumnNode = document.createElement('div'); bgColumnNode.className = 'col-sm-5';
     var bgGroupNode = document.createElement('div'); bgGroupNode.className = 'btn-group btn-sm';
     var firstButtonNode = this.CreateElement({ type: 'button', className: 'btn btn-sm btn-primary disabled', id: this.firstButtonId, html: 'First', buttonType: 'button' });
     var prevButtonNode = this.CreateElement({ type: 'button', className: 'btn btn-sm btn-primary disabled', id: this.prevButtonId, html: 'Previous', buttonType: 'button' });
     var nextButtonNode = this.CreateElement({ type: 'button', className: 'btn btn-sm btn-primary', id: this.nextButtonId, html: 'Next', buttonType: 'button' });
     var lastButtonNode = this.CreateElement({ type: 'button', className: 'btn btn-sm btn-primary', id: this.lastButtonId, html: 'Last', buttonType: 'button' });
     bgGroupNode.appendChild(firstButtonNode);
     bgGroupNode.appendChild(prevButtonNode);
     bgGroupNode.appendChild(nextButtonNode);
     bgGroupNode.appendChild(lastButtonNode);
     bgColumnNode.appendChild(bgGroupNode);

     //Create jump input
     var jumpColumnNode = document.createElement('div'); jumpColumnNode.className = 'col-sm-3';
     var jbgGroupNode = document.createElement('div'); jbgGroupNode.className = 'input-group';
     var jumpButtonSpanNode = document.createElement('span'); jumpButtonSpanNode.className = 'input-group-btn';
     var jumpButtonNode = this.CreateElement({ type: 'button', className: 'btn btn-primary btn-sm', id: this.jumpButtonId, html: 'Jump', buttonType: 'button' });
     var jumpInputNode = this.CreateElement({ type: 'input', className: 'form-control-sm col-sm-3', id: this.jumpInputId, buttonType: 'number' });
     jumpInputNode.setAttribute('name', 'jumpInput');
     jumpInputNode.value = '1';
     jumpButtonSpanNode.appendChild(jumpButtonNode);
     jbgGroupNode.appendChild(jumpButtonSpanNode);
     jbgGroupNode.appendChild(jumpInputNode);
     jumpColumnNode.appendChild(jbgGroupNode);

     //create table-pager pageSizer
     var pgSizerNode = document.createElement('div'); pgSizerNode.className = 'table-pageSizer';
     var labelPgSizerNode = this.CreateElement({ type: 'label', html: 'Page size:' });
     var sizerColumnNode = document.createElement('div'); sizerColumnNode.className = 'col-sm-4';
     var selectPgSizerNode = this.CreateElement({ type: 'select', className: 'input-sm', id: this.selectPgSizerId });
     selectPgSizerNode.setAttribute('name', 'pageSizer');
     pgSizerNode.appendChild(labelPgSizerNode);
     pgSizerNode.appendChild(selectPgSizerNode);
     sizerColumnNode.appendChild(pgSizerNode);

     pagingCtrlNode.appendChild(bgColumnNode);
     pagingCtrlNode.appendChild(jumpColumnNode);
     pagingCtrlNode.appendChild(sizerColumnNode);
     var insertPosition = document.getElementById(tableId).parentNode.parentNode;
     insertPosition.parentNode.insertBefore(pagingCtrlNode, insertPosition.nextSibling);

     //Initialize the pageSize dropdown list
     var optionValues = this.pagerSizeOptions[0];
     var optionText = this.pagerSizeOptions[1];
     var idx = 0;
     optionValues.forEach(function (opt) {
          var option = document.createElement('option');
          option.text = optionText[idx];
          option.value = opt;
          selectPgSizerNode.appendChild(option);
          idx++;
     });

     //Hook events for paging controls
     var self = this;
     firstButtonNode.addEventListener('click', function () { self.FirstPage(); });
     prevButtonNode.addEventListener('click', function () { self.PreviousPage(); });
     jumpButtonNode.addEventListener('click', function () { self.JumpPage(); });
     nextButtonNode.addEventListener('click', function () { self.NextPage(); });
     lastButtonNode.addEventListener('click', function () { self.LastPage(); });

     //Hook event for page size change
     selectPgSizerNode.addEventListener('change', function () { self.UpdatePageSize(); });

};

//Move to first display page
TurboTablesLib.prototype.FirstPage = function () {
     this.page = 1;
     //Start the spinner
     this.showSpinner(true);
     //Call data binding
     this.dataBinder(this.page, this.pageSize, this.sortColumn, this.sortDirection, this.filterColumn, this.filterValue);
};

//Move to previous display page
TurboTablesLib.prototype.PreviousPage = function () {
     if (this.page > 1) {
          this.page = this.page - 1;
          //Start the spinner
          this.showSpinner(true);
          //Call data binding
          this.dataBinder(this.page, this.pageSize, this.sortColumn, this.sortDirection, this.filterColumn, this.filterValue);
    }
};

//Move to any display page
TurboTablesLib.prototype.JumpPage = function () {
     var lastPage = 0, jumpPage = 1;
     var input = document.getElementById(this.jumpInputId);

     if (input.value !== "") {
          jumpPage = parseInt(input.value, 10);

          var remainder = this.totalItems % this.pageSize;
          if (remainder > 0) {
               lastPage = ((this.totalItems - remainder) / this.pageSize) + 1;
          }
          else {
               lastPage = this.totalItems / this.pageSize;
          }

          if (jumpPage < 0) { this.page = 1; }
          else if (jumpPage > lastPage) { this.page = lastPage }
          else { this.page = jumpPage; }

          //Start the spinner
          this.showSpinner(true);
          //Call data binding
          this.dataBinder(this.page, this.pageSize, this.sortColumn, this.sortDirection, this.filterColumn, this.filterValue);
     }
     
	 input.value = this.page;
};

//Move to next display page
TurboTablesLib.prototype.NextPage = function () {
    var lastPage = 0;

    var remainder = this.totalItems % this.pageSize;
    if (remainder > 0) {
         lastPage = ((this.totalItems - remainder) / this.pageSize) + 1;
    }
    else {
         lastPage = this.totalItems / this.pageSize;
    }

    if (this.page < lastPage) {
         this.page = this.page + 1;
         //Start the spinner
         this.showSpinner(true);
         //call data binding
         this.dataBinder(this.page, this.pageSize, this.sortColumn, this.sortDirection, this.filterColumn, this.filterValue);
    }
};

//Move to last display page
TurboTablesLib.prototype.LastPage = function () {
     var remainder = this.totalItems % this.pageSize;
     if (remainder > 0) {
          this.page = ((this.totalItems - remainder) / this.pageSize) + 1;
     }
     else {
          this.page = this.totalItems / this.pageSize;
     }

     //Start the spinner
     this.showSpinner(true);
     //call data binding
     this.dataBinder(this.page, this.pageSize, this.sortColumn, this.sortDirection, this.filterColumn, this.filterValue);
};

//Clear the filter column and value
TurboTablesLib.prototype.ClearFilterQuery = function () {
     this.filterColumn= '';
     this.filterValue = '';
     document.getElementById(this.selectFilterColumnId).selectedIndex = 0;
     document.getElementById(this.filterValueInputId).value = '';
};
//Query using the filter column and value
TurboTablesLib.prototype.FilterQuery = function () {
     var filterSelectElem;
     var found = false;

     this.filterColumn = this.getFilterColumn();
     this.filterValue = this.getFilterValue();

     if ((this.filterValue.length > 0) && (this.filterColumn.length > 0)) {
          //Start the spinner
          this.showSpinner(true);

          //call data binding
          this.dataBinder(this.page, this.pageSize, this.sortColumn, this.sortDirection, this.filterColumn, this.filterValue);
          this.ShowTableInfo();
     }
};

//UpdatePageSize
TurboTablesLib.prototype.UpdatePageSize = function () {
    var result = 1;
    //always reset to page 1 on Page Size change
    this.page = 1;

    var pageSizer = document.getElementById(this.selectPgSizerId);
    this.pageSize = parseInt(pageSizer.options[pageSizer.selectedIndex].value, 10);
    if (this.pageSize === -1)
        this.pageSize = this.totalItems;

    //Start the spinner
    this.showSpinner(true);
    //call data binding
    this.dataBinder(this.page, this.pageSize, this.sortColumn, this.sortDirection, this.filterColumn, this.filterValue);
    this.ShowTableInfo();
};

TurboTablesLib.prototype.UpdatePagerControls = function() {
     var lastPage = 0;

     var remainder = this.totalItems % this.pageSize;
     if (remainder > 0) {
          lastPage = ((this.totalItems - remainder) / this.pageSize) + 1;
     }
     else {
          lastPage = this.totalItems / this.pageSize;
     }

     document.getElementById(this.firstButtonId).className = 'btn btn-sm btn-primary';
     document.getElementById(this.prevButtonId).className = 'btn btn-sm btn-primary';
     document.getElementById(this.nextButtonId).className = 'btn btn-sm btn-primary';
     document.getElementById(this.lastButtonId).className = 'btn btn-sm btn-primary';

     if (this.page === 1) {
          document.getElementById(this.firstButtonId).className = 'btn btn-sm btn-primary disabled';
          document.getElementById(this.prevButtonId).className = 'btn btn-sm btn-primary disabled';
     }
     if (this.page === lastPage) {
          document.getElementById(this.nextButtonId).className = 'btn btn-sm btn-primary disabled';
          document.getElementById(this.lastButtonId).className = 'btn btn-sm btn-primary disabled';
     }
	 
	 document.getElementById(this.jumpInputId).value = this.page;
};

//show page number
TurboTablesLib.prototype.ShowTableInfo = function () {

     //Update the Table Info label
     var high = this.pageSize * this.page;
     if (high > this.totalItems)
          high = this.totalItems;
     if (this.page === 1)
          low = 1;
     else
          low = ((this.page - 1) * this.pageSize) + 1;
     var tableInfoText = this.tableInfoTemplate.replace('{0}', low).replace('{1}', high).replace('{2}', this.totalItems);
     document.getElementById(this.tableInfoId).innerHTML = tableInfoText;

     //Update the Pager controls
     this.UpdatePagerControls();
};

TurboTablesLib.prototype.SearchTable = function () {
     var input, search, tableBody, rows, rowData, rowIdx, dataIdx;
     var found = false;

     input = document.getElementById(this.searchInputId);
     search = input.value.toUpperCase();
     //really need body reference
     tableBody = document.getElementById(this.tableId).getElementsByTagName('tbody');
     rows = tableBody[0].getElementsByTagName('tr');

     for (rowIdx = 0; rowIdx < rows.length; rowIdx++) {
          rowData = rows[rowIdx].getElementsByTagName('td');
          for (dataIdx = 0; dataIdx < rowData.length; dataIdx++) {
               if (rowData[dataIdx].innerHTML.toUpperCase().indexOf(search) > -1) {
                    found = true;
                    break;
               };
          };

          if (found) {
               rows[rowIdx].style.display = '';
               found = false;
          }
          else {
               rows[rowIdx].style.display = 'none';
          }
     };
};

TurboTablesLib.prototype.ProcessSortEvent = function (id) {
     console.log('Processing sort event for col id: ' + id);
     //Find and restore the text of the last sort column
     var text = document.getElementById(this.sortColumn).firstChild.innerHTML;
     var idx = text.indexOf('<');
     if (idx > 0)
         text = text.substring(0, idx);
     document.getElementById(this.sortColumn).firstChild.innerHTML = text;

     //Find the new sort column, make it the new sort column, update it's text, and change the sort direction
     this.sortColumn = id;
     text = document.getElementById(id).firstChild.innerHTML;
     if (this.sortDirection === 'asc') {
          //document.getElementById(id).innerHTML = document.getElementById(id).innerHTML + '&#8595;' // Unicode 'down' arrow
          document.getElementById(id).firstChild.innerHTML = text + '<i class="fa fa-sort-desc"></i>';
          this.sortDirection = 'desc';
     }
     else {
          //document.getElementById(id).innerHTML = document.getElementById(id).innerHTML + '&#8593; ' // Unicode 'up' arrow
          document.getElementById(id).firstChild.innerHTML = text + '<i class="fa fa-sort-asc" ></i >';
          this.sortDirection = 'asc';
     }

     //Start the spinner
     this.showSpinner(true);
     //call data binding
     this.dataBinder(this.page, this.pageSize, this.sortColumn, this.sortDirection, this.filterColumn, this.filterValue);
};

TurboTablesLib.prototype.ToggleFilterRow = function () {
     var filterRow = document.getElementById(this.filterId);
     if (filterRow.style.display === 'none')
          filterRow.style.display = '';
     else {
          filterRow.style.display = 'none';
          this.filterProperty = "";
          this.filterPropertyValue = "";
          document.getElementById(this.selectFilterColumnId).selectedIndex = 0;
          document.getElementById(this.filterValueInputId).value = "";
     }
};

TurboTablesLib.prototype.CreateElement = function (options) {

     var element = document.createElement(options.type);
     if ((typeof options.id !== 'undefined') && options.id) element.id = options.id;
     if ((typeof options.className !== 'undefined') && options.className) element.className = options.className;
     switch (options.type) {
          case 'a':
               element.innerHTML = options.html;
               element.href = options.href;
               break;
          case 'button':
               element.innerHTML = options.html;
               element.setAttribute('type', options.buttonType);
               break;
          case 'form':
               if ((typeof options.action !== 'undefined') && options.action) element.action = options.action;
               break;
          case 'input':
               element.input = options.inputType;
               if ((typeof options.placeholder !== 'undefined') && options.placeholder) element.placeholder = options.placeholder;
               break;
          case 'label':
               element.innerHTML = options.html;
               break;
          default:
               break;
     }

     return element;
};