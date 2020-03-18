define({ "api": [
  {
    "type": "get",
    "url": "/api/v1/task/pause",
    "title": "pause long running task by id",
    "version": "1.0.0",
    "name": "pause_long_running_task_by_id",
    "group": "all",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Task ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "request-example",
          "content": "\ncurl http://<domain:port>/api/v1/task/pause?id=taskID",
          "type": "String"
        },
        {
          "title": "response-example",
          "content": "\n{\n     \"success\": true,\n     \"message\": \"Taks Paused\",\n     \"data\": {    \n                 \"id\": \"taskID\",\n                 \"isPaused\": 1,\n                 \"isCompleted\": 0,\n                 \"isTerminated\": 0   \n             },\n     \"error\": false\n}",
          "type": "json"
        }
      ]
    },
    "filename": "manager/controllers/task/controller.js",
    "groupTitle": "all"
  },
  {
    "type": "get",
    "url": "/api/v1/task/resume",
    "title": "resume a paused long running task by id",
    "version": "1.0.0",
    "name": "resume_a_paused_long_running_task_by_id",
    "group": "all",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Task ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "request-example",
          "content": "\ncurl http://<domain:port>/api/v1/task/resume?id=taskID",
          "type": "String"
        },
        {
          "title": "response-example",
          "content": "\n{\n     \"success\": true,\n     \"message\": \"Task resumed\",\n     \"data\": {    \n                 \"id\": \"taskID\",\n                 \"isPaused\": 0,\n                 \"isCompleted\": 0,\n                 \"isTerminated\": 0   \n             },\n     \"error\": false\n}",
          "type": "json"
        }
      ]
    },
    "filename": "manager/controllers/task/controller.js",
    "groupTitle": "all"
  },
  {
    "type": "get",
    "url": "/api/v1/task",
    "title": "show all tasks",
    "version": "1.0.0",
    "name": "show_all_tasks",
    "group": "all",
    "parameter": {
      "examples": [
        {
          "title": "request-example",
          "content": "\ncurl http://<domain:port>/api/v1/task",
          "type": "String"
        },
        {
          "title": "response-example",
          "content": "\n{\n     \"success\": true,\n     \"message\": null,\n     \"data\": {\n                 \"taskID1\": {\n                                 \"id\": \"taskID1\",\n                                 \"isPaused\": 0,\n                                 \"isCompleted\": 1,\n                                 \"isTerminated\": 0\n                           },\n                 \"taskID2\": {\n                                 \"id\": \"taskID2\",\n                                 \"isPaused\": 1,\n                                 \"isCompleted\": 0,\n                                 \"isTerminated\": 0\n                           }\n             },\n     \"error\": false\n}",
          "type": "json"
        }
      ]
    },
    "filename": "manager/controllers/task/controller.js",
    "groupTitle": "all"
  },
  {
    "type": "get",
    "url": "/api/v1/task/start",
    "title": "start a long running task",
    "version": "1.0.0",
    "name": "start_a_long_running_task",
    "group": "all",
    "parameter": {
      "examples": [
        {
          "title": "request-example",
          "content": "\ncurl http://<domain:port>/api/v1/task/start",
          "type": "String"
        },
        {
          "title": "response-example",
          "content": "\n{\n     \"success\": true,\n     \"message\": New Task Created,\n     \"data\": {\n                 \"id\": \"taskID\",\n                 \"isPaused\": 0,\n                 \"isCompleted\": 0,\n                 \"isTerminated\": 0\n             },\n     \"error\": false\n}",
          "type": "json"
        }
      ]
    },
    "filename": "manager/controllers/task/controller.js",
    "groupTitle": "all"
  },
  {
    "type": "get",
    "url": "/api/v1/task/terminate",
    "title": "terminate a long running task by id",
    "version": "1.0.0",
    "name": "terminate_a_long_running_task_by_id",
    "group": "all",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Task ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "request-example",
          "content": "\ncurl http://<domain:port>/api/v1/task/terminate?id=taskID",
          "type": "String"
        },
        {
          "title": "response-example",
          "content": "\n{\n     \"success\": true,\n     \"message\": \"Task terminated\",\n     \"data\": {    \n                 \"id\": \"taskID\",\n                 \"isPaused\": 0,\n                 \"isCompleted\": 0,\n                 \"isTerminated\": 1   \n             },\n     \"error\": false\n}",
          "type": "json"
        }
      ]
    },
    "filename": "manager/controllers/task/controller.js",
    "groupTitle": "all"
  },
  {
    "type": "get",
    "url": "/api/v1/task/view",
    "title": "view task by id",
    "version": "1.0.0",
    "name": "view_task_by_id",
    "group": "all",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Task ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "request-example",
          "content": "\ncurl http://<domain:port>/api/v1/task/view?id=taskID",
          "type": "String"
        },
        {
          "title": "response-example",
          "content": "\n{\n     \"success\": true,\n     \"message\": \"Task Found\",\n     \"data\": {    \n                 \"id\": \"taskID\",\n                 \"isPaused\": 0,\n                 \"isCompleted\": 1,\n                 \"isTerminated\": 0   \n             },\n     \"error\": false\n}",
          "type": "json"
        }
      ]
    },
    "filename": "manager/controllers/task/controller.js",
    "groupTitle": "all"
  }
] });
