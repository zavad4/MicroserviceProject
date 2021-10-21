'use strict';
const http = require('http');

//[host]/api/[serviceName]/route

http.get('http://localhost:7070/addBank', res => {
  console.log('addBank');
});

