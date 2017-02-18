'use strict';

//when you set the name of your application, it has to be changed on index.html in the ng-app directive
//and used for all the controllers
angular.module('robocupApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.router',
  'ui.slider',
  'restangular',
  'mgcrea.ngStrap',
  'ui.date',
  'angularFileUpload',
  'ngActivityIndicator'
]).config(['$httpProvider', '$urlRouterProvider', '$stateProvider', 'RestangularProvider', function ($httpProvider, $urlRouterProvider, $stateProvider, RestangularProvider) {

  RestangularProvider.setBaseUrl('/');
  //uncomment below if the name of the unique ID for remote database records is different from 'id'
  /*
  RestangularProvider.setRestangularFields({
    id: "uuid"
  });*/

  //set the default URL of the client web app
  $urlRouterProvider.otherwise('/home');

  //by using ui-router, we have the concept of states
  //a state is defined by one or many view/controller combinations and the URL that activates it
  //an example from the diary app is shown below
  //the first state is the 'template' state that has multiple slots of various views
  //each state can choose to full those slots with something different
  //a slot is defined by the ui-view="name" attribute on a HTML tag

  $stateProvider.state('robocup', {
    url: "",
    templateUrl: "views/main_layout.html",
    abstract: true
  }).state('robocup.home', {
    url: '/home',
    data: {
      "mainnavOption":"",
      "subnavOption":""
    },
    views: {
      "content": {
        templateUrl: "views/home/index.html",
        controller: 'HomeCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.admin', {
    url: '/admin',
    data: {
      "mainnavOption":"admin",
      "subnavOption":""
    },
    views: {
      "content": {
        templateUrl: "views/admin/index.html",
        controller: 'AdminCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.divisions', {
    url: '/admin/league/divisions',
    data: {
      "mainnavOption":"admin",
      "subnavOption":""
    },
    views: {
      "content": {
        templateUrl: "views/division/index.html",
        controller: 'DivisionCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.new-division', {
    url: '/admin/league/divisions/new',
    data: {
      "action":"new",
      "mainnavOption":"admin",
      "subnavOption":""
    },
    views: {
      "content": {
        templateUrl: "views/division/form.html",
        controller: 'DivisionFormCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.edit-division', {
    url: '/admin/league/divisions/:divisionId/edit',
    data: {
      "action":"edit",
      "mainnavOption":"admin",
      "subnavOption":""
    },
    views: {
      "content": {
        templateUrl: "views/division/form.html",
        controller: 'DivisionFormCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.teams', {
    url: '/admin/team',
    data: {
      "mainnavOption":"admin",
      "subnavOption":""
    },
    views: {
      "content": {
        templateUrl: "views/team/index.html",
        controller: 'TeamCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.new-team', {
    url: '/admin/team/new',
    data: {
      "mainnavOption":"admin",
      "subnavOption":"",
      "action":"new"
    },
    views: {
      "content": {
        templateUrl: "views/team/form.html",
        controller: 'TeamFormCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.edit-team', {
    url: '/admin/team/:teamId/edit',
    data: {
      "mainnavOption":"admin",
      "subnavOption":"",
      "action":"edit"
    },
    views: {
      "content": {
        templateUrl: "views/team/form.html",
        controller: 'TeamFormCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.show-team', {
    url: '/admin/team/:teamId',
    data: {
      "mainnavOption":"admin",
      "subnavOption":""
    },
    views: {
      "content": {
        templateUrl: "views/team/detail.html",
        controller: 'TeamDetailCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.score-sheets', {
    url: '/admin/score_sheets',
    data: {
      "mainnavOption":"admin",
      "subnavOption":""
    },
    views: {
      "content": {
        templateUrl: "views/score_sheet/index.html",
        controller: 'ScoreSheetCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.new-score-sheet', {
    url: '/admin/score_sheets/new',
    data: {
      "mainnavOption":"admin",
      "subnavOption":"",
      "action":"new"
    },
    views: {
      "content": {
        templateUrl: "views/score_sheet/form.html",
        controller: 'ScoreSheetFormCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.edit-score-sheet', {
    url: '/admin/score_sheets/:scoreSheetId/edit',
    data: {
      "mainnavOption":"admin",
      "subnavOption":"",
      "action":"edit"
    },
    views: {
      "content": {
        templateUrl: "views/score_sheet/form.html",
        controller: 'ScoreSheetFormCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.dance', {
    url: '/dance',
    data: {
      "mainnavOption":"dance",
      "subnavOption":"",
      "category":"dance"
    },
    views: {
      "content": {
        templateUrl: "views/dance/index.html",
        controller: 'DanceCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.new-score', {
    url: '/dance/:divisionId/score/:scoreSheetTemplateId/new',
    data: {
      "mainnavOption":"admin",
      "subnavOption":"",
      "action":"new"
    },
    views: {
      "content": {
        templateUrl: "views/dance/score.html",
        controller: 'ScoreCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.edit-score', {
    url: '/dance/:divisionId/score/:scoreSheetId/edit',
    data: {
      "mainnavOption":"admin",
      "subnavOption":"",
      "action":"edit"
    },
    views: {
      "content": {
        templateUrl: "views/dance/score.html",
        controller: 'ScoreCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.dance-interview-new', {
    url: '/dance/interview/new',
    data: {
      "mainnavOption":"dance",
      "subnavOption":"",
      "action":"new",
      "category":"dance"
    },
    views: {
      "content": {
        templateUrl: "views/dance/dance_interview_form.html",
        controller: 'DanceInterviewFormCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.dance-performance-new', {
    url: '/dance/performance/new',
    data: {
      "mainnavOption":"dance",
      "subnavOption":"",
      "action":"new",
      "category":"Dance"
    },
    views: {
      "content": {
        templateUrl: "views/dance/dance_performance_form.html",
        controller: 'DancePerformanceFormCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.user', {
    url: '/admin/user',
    data: {
      "mainnavOption":"admin",
      "subnavOption":""
    },
    views: {
      "content": {
        templateUrl: "views/user/index.html",
        controller: 'UserCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.new-user', {
    url: '/admin/user/new',
    data: {
      "mainnavOption":"admin",
      "subnavOption":"",
      "action":"new"
    },
    views: {
      "content": {
        templateUrl: "views/user/form.html",
        controller: 'UserFormCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.user-submissions', {
    url: '/me',
    data: {
      "mainnavOption":"me",
      "subnavOption":""
    },
    views: {
      "content": {
        templateUrl: "views/user/submissions.html",
        controller: 'UserSubmissionListCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.dance-interview-edit', {
    url: '/dance/interview/:danceInterviewId/edit',
    data: {
      "mainnavOption":"dance",
      "subnavOption":"",
      "action":"edit",
      "category":"dance"
    },
    views: {
      "content": {
        templateUrl: "views/dance/dance_interview_form.html",
        controller: 'DanceInterviewFormCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.dance-performance-edit', {
    url: '/dance/performance/:dancePerformanceId/edit',
    data: {
      "mainnavOption":"dance",
      "subnavOption":"",
      "action":"edit",
      "category":"Dance"
    },
    views: {
      "content": {
        templateUrl: "views/dance/dance_performance_form.html",
        controller: 'DancePerformanceFormCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  }).state('robocup.dance-team-detail', {
    url: '/dance/team/:teamId',
    data: {
      "mainnavOption":"dance",
      "subnavOption":"",
    },
    views: {
      "content": {
        templateUrl: "views/team/detail.html",
        controller: 'TeamDetailCtrl'
      },
      "mainnav": {
        templateUrl: "views/main_nav.html",
        controller: 'NavCtrl'
      }
    }
  });
}]);
