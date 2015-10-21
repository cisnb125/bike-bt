angular.module('starter.services', [])

  .factory('Chats', function () {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: 0,
      name: 'Ben Sparrow',
      lastText: 'You on your way?',
      face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
    }, {
      id: 1,
      name: 'Max Lynx',
      lastText: 'Hey, it\'s me',
      face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
    }, {
      id: 2,
      name: 'Andrew Jostlin',
      lastText: 'Did you get the ice cream?',
      face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
    }, {
      id: 3,
      name: 'Adam Bradleyson',
      lastText: 'I should buy a boat',
      face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
    }, {
      id: 4,
      name: 'Perry Governor',
      lastText: 'Look at my mukluks!',
      face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
    }];

    return {
      all: function () {
        return chats;
      },
      remove: function (chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function (chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  })

  .factory('BLE', function ($q) {

    var connected;

    return {

      devices: [],

      list: function() {
        var deferred = $q.defer();
        console.log("Looking for Bluetooth Devices...");

        bluetoothSerial.list(function(devices) {
            for (i = 0; i < devices.length; i++) {
              var obj = devices[i];
              console.log('Device', i, ':', JSON.stringify(obj, null, 4));
            }
            deferred.resolve(devices);
          }, function(error) {
            console.log('error');
            deferred.reject(error);
          });

        return deferred.promise;
      },

      newConnect: function(id) {
        var deferred = $q.defer();

        bluetoothSerial.connectInsecure(id, function() {
          console.log('success');
          deferred.resolve();
        }, function() {
          console.log('failed');
          deferred.reject();
        });

        return deferred.promise;
      },

      scan: function () {
        var that = this;
        var deferred = $q.defer();

        console.log('BLE.scan - scanning');

        that.devices.length = 0;

        // disconnect the connected device (hack, device should disconnect when leaving detail page)
        if (connected) {
          var id = connected.id;
          //bluetoothSerial.disconnect();
          ble.disconnect(connected.id, function () {
            console.log("Disconnected " + id);
          });
          connected = null;
        }

        ble.startScan([], /* scan for all services */
          function (peripheral) {
            that.devices.push(peripheral);
          },
          function (error) {
            deferred.reject(error);
          });



        bluetoothSerial.list(function(peripheral) {
          //that.devices = peripheral;
          for (i = 0; i < peripheral.length; i++) {
            var obj = peripheral[i];
            console.log('Device', i, ':', JSON.stringify(obj, null, 4));
          }
          //deferred.resolve();
        }, function(error) {
          //deferred.reject(error);
        });

         //stop scan after 5 seconds
        setTimeout(ble.stopScan, 5000,
          function () {
            for (i = 0; i < that.devices.length; i++) {
              var obj = that.devices[i];
              console.log('Device', i, ':', JSON.stringify(obj, null, 4));
            }
            deferred.resolve();
          },
          function () {
            console.log("stopScan failed");
            deferred.reject("Error stopping scan");
          }
        );

        return deferred.promise;
      },
      connect: function (deviceId) {
        console.log('BLE.connect - deviceId:', deviceId);
        var deferred = $q.defer();

        //ble.connect(deviceId,
        bluetoothSerial.connectInsecure(deviceId,
          function (peripheral) {
            console.log('bluetoothSerial.connect - connected');
            connected = peripheral;
            deferred.resolve(peripheral);
          },
          function (reason) {
            console.log('bluetoothSerial.connect - failed');
            deferred.reject(reason);
          }
        );

        return deferred.promise;
      }
    };
  });
