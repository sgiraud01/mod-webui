/* Copyright (C) 2009-2015:
   Gabes Jean, naparuba@gmail.com
   Gerhard Lausser, Gerhard.Lausser@consol.de
   Gregory Starck, g.starck@gmail.com
   Hartmut Goebel, h.goebel@goebel-consult.de
   Andreas Karfusehr, andreas@karfusehr.de
   Frederic Mohier, frederic.mohier@gmail.com

   This file is part of Shinken.

   Shinken is free software: you can redistribute it and/or modify
   it under the terms of the GNU Affero General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   Shinken is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU Affero General Public License for more details.

   You should have received a copy of the GNU Affero General Public License
   along with Shinken.  If not, see <http://www.gnu.org/licenses/>.
*/

var eltdetail_logs=true;

// @mohierf@: really need this global ?
var elt_name = '{{elt.get_full_name()}}';


/*
 * Function called when the page is loaded and on each page refresh ...
 */
function on_page_refresh() {
   // Buttons tooltips
   $('button').tooltip();

   // Buttons as switches
   $('input.switch').bootstrapSwitch();

   // Elements popover
   $('[data-toggle="popover"]').popover();

   $('[data-toggle="popover medium"]').popover({ 
      trigger: "hover", 
      placement: 'bottom',
      toggle : "popover",
      viewport: {
         selector: 'body',
         padding: 10
      },
      
      template: '<div class="popover popover-medium"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>',
   });

   /**
    * Page refresh and tabs management 
    * ---------
    * Commented: use a Js instead in layout.tpl !
    * ---------
   // Look at the hash part of the URI. If it match a nav name, go for it
   if (location.hash.length > 0) {
      if (eltdetail_logs) console.debug('Displaying tab: ', location.hash)
      $('.nav-tabs li a[href="' + location.hash + '"]').trigger('click');
   } else {
      if (eltdetail_logs) console.debug('Displaying first tab')
      $('.nav-tabs li a:first').trigger('click');
   }
   
   // Avoid scrolling the window when a nav tab is selected ...
   // Not functionnal !
   $('.nav-tabs li a').click(function(e){
      if (eltdetail_logs) console.debug('Clicked ', $(this).attr('href'))
      // Try to stop bootstrap scroll to anchor effect ...
      e.preventDefault();
      e.stopImmediatePropagation();
      // Display tab
      $(this).tab('show');
   });

   // When a nav item is selected update the page hash
   $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      if (eltdetail_logs) console.debug('Shown ', $(this).attr('href'))
      location.hash = $(this).attr('href');
   })
    */
   
   
   /*
    * Custom views 
    */
   $('.cv_pane').on('shown.bs.tab', function (e) {
      show_custom_view($(this));
   })

   // Show each active custom view
   $('.cv_pane.active').each(function(index, elt ) {
      var cvname = $(elt).data('name');
      if (! _already_loaded[cvname]) {
         show_custom_view($(elt));
      } else {
         if (eltdetail_logs) console.debug('Custom view '+cvname+' already exists !');
         reload_custom_view($(elt));
      }
   });
   
   /*
    * Dependency graph
    */
   $('#tab_to_depgraph').on('shown.bs.tab', function (e) {
      // First we get the full name of the object from div data
      var n = $('#inner_depgraph').attr('data-elt-name');
      // Then we load the inner depgraph page. Easy isn't it? :)
      $('#inner_depgraph').load('/inner/depgraph/'+n);
   });
   
   // Fullscreen management
   $('button[action="fullscreen-request"]').click(function() {
      screenfull.request($('#inner_depgraph')[0]);
   });

   // Trigger the onchange() to set the initial values
   screenfull.onchange();

   
   /*
    * Commands buttons
    */
   // Change a custom variable
   $('button[action="change-variable"]').click(function () {
      var elt = $(this).data('element');
      var variable = $(this).data('variable');
      var value = $(this).data('value');
      if (eltdetail_logs) console.debug("Button - set custom variable '"+variable+"'="+value+" for: ", elt)
      
      display_form("/forms/change_var/"+elt+"?variable="+variable+"&value="+value);
   });

   // Add a comment
   $('button[action="add-comment"]').click(function () {
      var elt = $(this).data('element');
      if (eltdetail_logs) console.debug("Button - add a comment for: ", elt)
      
      display_form("/forms/comment/add/"+elt);
   });
   
   // Delete a comment
   $('button[action="delete-comment"]').click(function () {
      var elt = $(this).data('element');
      var comment = $(this).data('comment');
      if (eltdetail_logs) console.debug("Button - delete comment '"+comment+"' for: ", elt)
      
      display_form("/forms/comment/delete/"+elt+"?comment="+comment);
   });
   
   // Delete all comments
   $('button[action="delete-comments"]').click(function () {
      var elt = $(this).data('element');
      if (eltdetail_logs) console.debug("Button - delete all comments for: ", elt)
      
      display_form("/forms/comment/delete_all/"+elt);
   });
  
   // Schedule a downtime ...
   $('button[action="schedule-downtime"]').click(function () {
      var elt = $(this).data('element');
      if (eltdetail_logs) console.debug("Button - schedule a downtime for: ", elt)
      
      display_form("/forms/downtime/add/"+$(this).data('element'));
   });
   
   // Delete a downtime
   $('button[action="delete-downtime"]').click(function () {
      var elt = $(this).data('element');
      var downtime = $(this).data('downtime');
      if (eltdetail_logs) console.debug("Button - delete downtime '"+downtime+"' for: ", elt)
      
      display_form("/forms/downtime/delete/"+elt+"?downtime="+downtime);
   });
   
   // Delete all downtimes
   $('button[action="delete-downtimes"]').click(function () {
      var elt = $(this).data('element');
      if (eltdetail_logs) console.debug("Button - delete all downtimes for: ", elt)
      
      display_form("/forms/downtime/delete_all/"+$(this).data('element'));
   });

   // Add an acknowledge
   $('button[action="add-acknowledge"]').click(function () {
      var elt = $(this).data('element');
      if (eltdetail_logs) console.debug("Button - add an acknowledge for: ", elt)
      
      display_form("/forms/acknowledge/add/"+elt);
   });

   // Delete an acknowledge
   $('button[action="remove-acknowledge"]').click(function () {
      var elt = $(this).data('element');
      if (eltdetail_logs) console.debug("Button - add an acknowledge for: ", elt)
      
      display_form("/forms/acknowledge/remove/"+elt);
   });

   // Recheck
   $('button[action="recheck"]').click(function () {
      var elt = $(this).data('element');
      if (eltdetail_logs) console.debug("Button - recheck for: ", elt)
      
      recheck_now(elt);
   });

   // Check result
   $('button[action="check-result"]').click(function () {
      var elt = $(this).data('element');
      if (eltdetail_logs) console.debug("Button - submit a check result for: ", elt)
      
      display_form("/forms/submit_check/"+elt);
   });

   // Event handler
   $('button[action="event-handler"]').click(function () {
      var elt = $(this).data('element');
      if (eltdetail_logs) console.debug("Button - try to fix: ", elt)
      
      try_to_fix(elt);
   });


   
   // Toggles ...
   $('input[action="toggle-active-checks"]').on('switch-change', function (e, data) {
      var elt = $(this).data('element');
      var value = $(this).data('value')=='False' ? false : true;
      if (eltdetail_logs) console.debug("Toggle active checks for: ", elt, ", currently: ", value)
      toggle_active_checks(elt, value);
   });
   $('input[action="toggle-passive-checks"]').on('switch-change', function (e, data) {
      var elt = $(this).data('element');  
      var value = $(this).data('value')=='False' ? false : true;
      if (eltdetail_logs) console.debug("Toggle passive checks for: ", elt, ", currently: ", value)
      toggle_passive_checks(elt, value);
   });
   $('input[action="toggle-check-freshness"]').on('switch-change', function (e, data) {
      var elt = $(this).data('element');  
      var value = $(this).data('value')=='False' ? false : true;
      if (eltdetail_logs) console.debug("Toggle freshness checks for: ", elt, ", currently: ", value)
      toggle_freshness_check(elt, value);
   });
   $('input[action="toggle-notifications"]').on('switch-change', function (e, data) {
      var elt = $(this).data('element');  
      var value = $(this).data('value')=='False' ? false : true;
      if (eltdetail_logs) console.debug("Toggle notifications for: ", elt, ", currently: ", value)
      toggle_notifications(elt, value);
   });
   $('input[action="toggle-event-handler"]').on('switch-change', function (e, data) {
      var elt = $(this).data('element');  
      var value = $(this).data('value')=='False' ? false : true;
      if (eltdetail_logs) console.debug("Toggle event handler for: ", elt, ", currently: ", value)
      toggle_event_handlers(elt, value);
   });
   $('input[action="toggle-process-perfdata"]').on('switch-change', function (e, data) {
      var elt = $(this).data('element');  
      var value = $(this).data('value')=='False' ? false : true;
      if (eltdetail_logs) console.debug("Toggle perfdata processing for: ", elt, ", currently: ", value)
      toggle_process_perfdata(elt, value);
   });
   $('input[action="toggle-flap-detection"]').on('switch-change', function (e, data) {
      var elt = $(this).data('element');  
      var value = $(this).data('value')=='False' ? false : true;
      if (eltdetail_logs) console.debug("Toggle flap detection for: ", elt, ", currently: ", value)
      toggle_flap_detection(elt, value);
   });


   /*
    * History / logs
    */
   $('a[data-toggle="tab"][href="#history"]').on('shown.bs.tab', function (e) {
      // First we get the full name of the object from div data
      var element = $('#inner_history').data('element');
      
      $.ajax({
         "url": '/logs/inner/'+element,
         "dataType": "json",
         "success": function (response){
            $("#inner_history").empty();
            var table = $('<table />').addClass('table-condensed').addClass('table-bordered').appendTo("#inner_history");
            var tr = $('<thead />').appendTo(table);
            $('<th />').html('Time').appendTo(tr);
            $('<th />').html('Service').appendTo(tr);
            $('<th />').html('Message').appendTo(tr);
            
            $('<tbody />').css({fontSize: "x-small"}).appendTo(table);

            var tr;
            $.each(response, function (index, log) {
               tr = $('<tr />').appendTo("#inner_history table tbody");
               $('<td />').html(moment.unix(log.timestamp).format('YYYY-MM-DD HH:mm:ss')).appendTo(tr);
               $('<td />').html(log.service).appendTo(tr);
               $('<td />').html(log.message).appendTo(tr);
            });
         },
         "error": function (response){
           console.error(response);
         }
      });
   })


   /*
    * Timeline
    */
   $('a[data-toggle="tab"][href="#timeline"]').on('shown.bs.tab', function (e) {
      // First we get the full name of the object from div data
      var hostname = $('#inner_timeline').data('element');
      // Get timeline tab content ...
      $('#inner_timeline').load('/timeline/inner/'+hostname);
      
   })
   
   
   /*
    * Graphs
    */
   // This to allow the range to change after the page is loaded.
   get_range();
   
   /* We can't apply Jcrop on ready. Why? Because the images are not yet loaded, and so
      they will have a null size. So how to do it?
      The key is to hook the graph tab. onshow will raise when we active it (and was shown).
   */
   $('#tab_to_graphs').on('shown.bs.tab', function (e) {
      // console.log("Display graph: ", current_graph)
      $('a[data-type="graph"][data-period="'+current_graph+'"]').trigger('click');
   })
   
   // Change graph
   $('a[data-type="graph"]').click(function (e) {
      current_graph=$(this).data('period');
      graphstart=$(this).data('graphstart');
      graphend=$(this).data('graphend');

      // Update graphs
      $("#real_graphs").html( html_graphes[current_graph] );

      // Update active period selected
      $("#graph_periods li.active").removeClass('active');
      $(this).parent('li').addClass('active');
      
      // and call the jcrop javascript
      $('.jcropelt').Jcrop({
         onSelect: update_coords,
         onChange: update_coords
      });
      get_range();
   });
}


/* 
 * Host/service aggregation toggle image button action 
 */
function toggleAggregationElt(e) {
    var toc = document.getElementById('aggregation-node-'+e);
    var imgLink = document.getElementById('aggregation-toggle-img-'+e);

    img_src = '/static/images/';

    if (toc && toc.style.display == 'none') {
        toc.style.display = 'block';
        if (imgLink != null){
            imgLink.src = img_src+'reduce.png';
        }
    } else {
        toc.style.display = 'none';
        if (imgLink != null){
            imgLink.src = img_src+'expand.png';
        }
    }
}


/* The business rules toggle buttons*/
function toggleBusinessElt(e) {
    //alert('Toggle'+e);
    var toc = document.getElementById('business-parents-'+e);
    var imgLink = document.getElementById('business-parents-img-'+e);

    img_src = '/static/images/';

    if (toc && toc.style.display == 'none') {
   toc.style.display = 'block';
   if (imgLink != null){
       imgLink.src = img_src+'reduce.png';
   }
    } else {
   toc.style.display = 'none';
   if (imgLink != null){
       imgLink.src = img_src+'expand.png';
   }
    }
}
