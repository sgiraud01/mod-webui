%rebase("layout", css=['groups/css/groups-overview.css'], title='Services groups overview', refresh=True)

%helper = app.helper
%services = app.get_services(user)
%s = helper.get_synthesis(services)['services']


<div id="servicesgroups">
   <!-- Progress bar -->
   <div class="panel panel-default">
      <div class="panel-body">
         <div class="pull-left col-sm-2">
            <span class="pull-right">Total services: {{s['nb_elts']}}</span>
         </div>
         <div class="progress" style="margin-bottom: 0px;">
            <div title="{{s['nb_ok']}} services Ok" class="progress-bar progress-bar-success quickinfo" role="progressbar" 
               data-toggle="tooltip" data-placement="bottom" 
               style="width: {{s['pct_ok']}}%;">{{s['pct_ok']}}% Ok</div>

            <div title="{{s['nb_critical']}} services Critical" class="progress-bar progress-bar-danger quickinfo" role="progressbar" 
               data-toggle="tooltip" data-placement="bottom" 
               style="width: {{s['pct_critical']}}%;">{{s['pct_critical']}}% Critical</div>

            <div title="{{s['nb_warning']}} services  Warning" class="progress-bar progress-bar-warning quickinfo" role="progressbar" 
               data-toggle="tooltip" data-placement="bottom" 
               style="width: {{s['pct_warning']}}%;">{{s['pct_warning']}}% Warning</div>

            <div title="{{s['nb_pending']}} services Pending" class="progress-bar progress-bar-info quickinfo" role="progressbar" 
               data-toggle="tooltip" data-placement="bottom" 
               style="width: {{s['pct_pending']}}%;">{{s['pct_pending']}}% Pending</div>

            <div title="{{s['nb_unknown']}} services Unknown" class="progress-bar progress-bar-info quickinfo" role="progressbar" 
               data-toggle="tooltip" data-placement="bottom" 
               style="width: {{s['pct_unknown']}}%;">{{s['pct_unknown']}}% Unknown</div>
         </div>
      </div>
   </div>

   <!-- Groups list -->
   <ul id="groups" class="list-group">
      %even='alt'
      %if level==0:
         %nServices=s['nb_elts']
         %nGroups=len(servicegroups)
         <li class="all_groups list-group-item clearfix {{even}} {{'empty' if s['nb_elts'] == s['nb_critical'] and s['nb_elts'] != 0 else ''}}">
            <section class="left">
               <h3>
                  <a role="menuitem" href="/all?search=type:service"><i class="fa fa-angle-double-down"></i>
                     All services {{!helper.get_business_impact_text(s['bi'])}}
                  </a>
               </h3>
               <div>
                  %for state in 'ok', 'warning', 'critical':
                  <span class="{{'font-' + state if s['nb_' + state] > 0 else 'font-greyed'}}">
                    %label = "%s <i>(%s%%)</i>" % (s['nb_' + state], s['pct_' + state])
                    {{!helper.get_fa_icon_state_and_label(cls='service', state=state, label=label)}}
                  </span>
                  %end
               </div>
               <div>
                  %for state in 'pending', 'unknown', 'ack', 'downtime':
                  <span class="{{'font-' + state if s['nb_' + state] > 0 else 'font-greyed'}}">
                    %label = "%s <i>(%s%%)</i>" % (s['nb_' + state], s['pct_' + state])
                    {{!helper.get_fa_icon_state_and_label(cls='service', state=state, label=label)}}
                  </span>
                  %end
               </div>
            </section>
            
            <section class="right">
               <section class="notes">
               </section>
               
               <section class="groups">
                  <div class="btn-group btn-group-justified" role="group" aria-label="Minemap">
                     <a class="btn btn-default" href="/minemap?search=type:service"><i class="fa fa-table"></i> Minemap</a>
                  </div>
                  
                  <ul class="list-group">
                     <li class="list-group-item">&nbsp;</li>
                     <li class="list-group-item"><span class="badge">{{s['nb_elts']}}</span>Services</li>
                     <li class="list-group-item"><span class="badge">{{nGroups}}</span>Groups</li>
                  </ul>
               </section>
            </section>
         </li>
      %end
    
      %even='alt'
      %for group in servicegroups:
         %if group.has('level')and group.level != level:
         %continue
         %end

         %services = app.search_hosts_and_services('type:service sg:'+group.get_name(), user)
         %s = helper.get_synthesis(services)['services']
         %if even =='':
           %even='alt'
         %else:
           %even=''
         %end

         %nServices=s['nb_elts']
         %nGroups=len(group.get_servicegroup_members())
         %# Filter empty groups ?
         %#if nServices > 0 or nGroups > 0:
         <li class="group list-group-item clearfix {{'empty' if s['nb_elts'] == s['nb_critical'] and s['nb_elts'] != 0 else ''}} {{even}}">
            <section class="left">
               <h3>
                  <a role="menuitem" href="/all?search=type:service sg:{{group.get_name()}}"><i class="fa fa-angle-double-down"></i>
                     {{group.alias if group.alias != '' else group.get_name()}} {{!helper.get_business_impact_text(s['bi'])}}</h3>
                  </a>
               <div>
                  %for state in 'ok', 'warning', 'critical':
                  <span class="{{'font-' + state if s['nb_' + state] > 0 else 'font-greyed'}}">
                    %label = "%s <i>(%s%%)</i>" % (s['nb_' + state], s['pct_' + state])
                    {{!helper.get_fa_icon_state_and_label(cls='service', state=state, label=label)}}
                  </span>
                  %end
               </div>
               <div>
                  %for state in 'pending', 'unknown', 'ack', 'downtime':
                  <span class="{{'font-' + state if s['nb_' + state] > 0 else 'font-greyed'}}">
                    %label = "%s <i>(%s%%)</i>" % (s['nb_' + state], s['pct_' + state])
                    {{!helper.get_fa_icon_state_and_label(cls='service', state=state, label=label)}}
                  </span>
                  %end
               </div>
            </section>
          
            <section class="right">
               <section class="notes">
                  %notes = helper.get_element_notes_url(group, default_title="Comment", default_icon="comment", popover=True)
                  %if len(notes):
                  <ul class="list-group">
                     <li class="list-group-item">
                        <strong>Notes:</strong>
                     </li>
                     %for note_url in notes:
                     <li class="list-group-item">
                        <button class="btn btn-default btn-xs">{{! note_url}}</button>
                     </li>
                     %end
                  </ul>
                  %end
               </section>
               
               <section class="groups">
                  <div class="btn-group btn-group-justified" role="group" aria-label="Minemap">
                     <a class="btn btn-default" href="/minemap?search=type:service sg:{{group.get_name()}}"><i class="fa fa-table"></i> Minemap</a>
                  </div>
                  
                  <ul class="list-group">
                     <li class="list-group-item">
                     %if nGroups > 0:
                     <a class="text-left" role="menuitem" href="services-groups?level={{int(level+1)}}&parent={{group.get_name()}}"><i class="fa fa-level-down"></i>
                     Down
                     </a>
                     %else:
                     &nbsp;
                     %end
                     
                     %if group.has('level') and group.level > 0:
                     <a class="text-right" role="menuitem" href="services-groups?level={{int(level-1)}}"><i class="fa fa-level-up"></i>
                     Up
                     </a>
                     %else:
                     &nbsp;
                     %end
                     </li>
                     <li class="list-group-item"><span class="badge">{{s['nb_elts']}}</span>Services</li>
                     <li class="list-group-item"><span class="badge">{{nGroups}}</span>Groups</li>
                  </ul>
               </section>
            </section>
         </li>
         %#end
      %end
   </ul>
</div>
