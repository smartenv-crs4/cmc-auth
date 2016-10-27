

//var microservices=require('./models/microservices').Microservice;


var config = {

  dev:{
      dbHost:'your_db_host_if_not_in_env',
      dbPort:'27017',
      dbName:'CP2020AuthDev',
      limit:50,
      skip:0,
      logfile:"/var/log/caport2020User-Microservice.log",
      AdminDefaultUser : {
          "email": "admin@admin.com",
          "password": "admin",
          "type":"admin"
      },
      userType:["admin","crocierista" , "ente", "operatore"], //admin is a superuser then it must not be deleted or moved from position [0] in the array
      appType:["webui", "ext", "user","ms"], //webUi is an internal microservice then it must not be deleted or moved from position [0] in the array
      //MyMicroserviceToken:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoibXMiLCJpc3MiOiJub3QgdXNlZCBmbyBtcyIsImVtYWlsIjoibm90IHVzZWQgZm8gbXMiLCJ0eXBlIjoiYXV0aG1zIiwiZW5hYmxlZCI6dHJ1ZSwiZXhwIjoxNzg5OTk3NjcxNjc3fQ.D5RVpcl7pgWwxa0Q5KRhoU079zocNtBTAXLuieYyDZQ",
      MyMicroserviceToken:"",
      msType:["userms" , "appms", "mailerms","authms"], // do not remove AuthMs that is this
      myMicroserviceBaseUrl:"http://localhost:3000",
      iconsList:["fa-support","fa-unlock-alt","fa-envelope","fa-search","fa-glass","fa-bar-chart-o","fa-envelope-o","fa-key","fa-gears","fa-desktop","fa-laptop","fa-th","fa-thumbs-o-up","fa-mobile","fa-check","fa-th-list","fa-times","fa-sign-out","fa-signal","fa-gear","fa-external-link","fa-sign-in","fa-spinner","fa-archive","fa-bug","fa-home","fa-clock-o","fa-download","fa-bookmark-o","fa-unlock","fa-credit-card","fa-rss","fa-hdd-o","fa-bullhorn","fa-bell","fa-location-arrow","fa-crop","fa-code-fork","fa-qrcode","fa-barcode","fa-tags","fa-book","fa-bookmark","fa-print","fa-camera","fa-globe","fa-wrench","fa-tasks","fa-filter","fa-briefcase","fa-users","fa-calendar","fa-comment","fa-link","fa-cloud","fa-cut","fa-pencil","fa-rss-square","fa-table","fa-database","fa-sitemap","fa-dropbox","fa-retweet","fa-file-text","fa-random","fa-share-alt","fa-share-alt-square","fa-folder-open","fa-table","fa-magic","fa-ticket","fa-recycle","fa-cube","fa-cubes","fa-save","fa-globe"],
      consuleUrl:"http://localhost:8500/v1/agent/services",
      consuleUrlHealt:"http://localhost:8500/v1/health/service/"
  },

  production:{
        dbHost:'your_db_host_if_not_in_env',
        dbPort:'27017',
        dbName:'CP2020Auth',
        limit:50,
        skip:0,
        logfile:"/var/log/caport2020User-Microservice.log",
        AdminDefaultUser : {
          "email": "admin@admin.com",
          "password": "admin",
          "type":"admin"
        },
        //userType:["admin","crocierista" , "ente", "operatore"], //admin is a superuser then it must not be deleted or moved from position [0] in the array
        //appType:["webuiMS", "ext", "user","ms"],
        MyMicroserviceToken:"",
        //msType:["AppService" , "UsersService", "ContentsService","AuthMs","webuiMS"], // do not remove AuthMs that is this
        //msWebUiIcon:[{icon:"fa-share-alt", color:"panel-yellow"} , {icon:"UsersService", color:""}, {icon:"ContentsService", color:""} , {icon:"AuthMs", color:""}, {icon:"webuiMS", color:""}],
        //msWebUiIcon:[{name:"AuthMs", icon:"fa-unlock-alt", color:"panel-info"},{name:"AppService",icon:"fa-share-alt", color:"panel-primary"},{name:"UsersService", icon:"fa-users", color:"panel-red"}],
        //prova:"panel-yellow",
        myMicroserviceBaseUrl:"http://localhost:3000",
        iconsList:["fa-support","fa-unlock-alt","fa-envelope","fa-search","fa-glass","fa-bar-chart-o","fa-envelope-o","fa-key","fa-gears","fa-desktop","fa-laptop","fa-th","fa-thumbs-o-up","fa-mobile","fa-check","fa-th-list","fa-times","fa-sign-out","fa-signal","fa-gear","fa-external-link","fa-sign-in","fa-spinner","fa-archive","fa-bug","fa-home","fa-clock-o","fa-download","fa-bookmark-o","fa-unlock","fa-credit-card","fa-rss","fa-hdd-o","fa-bullhorn","fa-bell","fa-location-arrow","fa-crop","fa-code-fork","fa-qrcode","fa-barcode","fa-tags","fa-book","fa-bookmark","fa-print","fa-camera","fa-globe","fa-wrench","fa-tasks","fa-filter","fa-briefcase","fa-users","fa-calendar","fa-comment","fa-link","fa-cloud","fa-cut","fa-pencil","fa-rss-square","fa-table","fa-database","fa-sitemap","fa-dropbox","fa-retweet","fa-file-text","fa-random","fa-share-alt","fa-share-alt-square","fa-folder-open","fa-table","fa-magic","fa-ticket","fa-recycle","fa-cube","fa-cubes","fa-save","fa-globe"],
        consuleUrl:"http://localhost:8500/v1/agent/services",
        consuleUrlHealt:"http://localhost:8500/v1/health/service/"
  }

};

var conf;

if (process.env['NODE_ENV'] === 'dev') {
    conf = config.dev;
}
else{
    conf = config.production;
}

if (process.env['dbHost']) {
conf.dbHost=process.env['dbHost'];
}

module.exports.conf = conf;
module.exports.generalConf = config;
