var SERVICE = '0000dfb0-0000-1000-8000-00805f9b34fb';
var CHAR_RXTX = '0000dfb1-0000-1000-8000-00805f9b34fb';
var TX_DESCRIPTOR = '00002902-0000-1000-8000-00805f9b34fb';

angular.module('starter.controllers', [])

  .controller('DashCtrl', function ($scope) {
  })

  .controller('ChatsCtrl', function ($scope, Chats) {
    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  })

  .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
  })

  .controller('BLECtrl', function ($scope, BLE) {

    // keep a reference since devices will be added
    $scope.devices = BLE.devices;

    var success = function () {
      if ($scope.devices.length < 1) {
        // a better solution would be to update a status message rather than an alert
        alert("Didn't find any Bluetooth Low Energy devices.");
      }
    };

    var failure = function (error) {
      alert(error);
    };

    // pull to refresh
    $scope.onRefresh = function () {
      BLE.scan().then(
        success, failure
      ).finally(
        function () {
          $scope.$broadcast('scroll.refreshComplete');
        }
      )
    };

    // initial scan
    //BLE.scan().then(success, failure);

    BLE.list().then(function(devices) {
      console.log('successfully fetched');
      $scope.devices = devices;
    });

  })

  .controller('BLEDetailCtrl', function ($scope, $stateParams, BLE) {
    //BLE.connect($stateParams.deviceId).then(
    //  function (peripheral) {
    //    $scope.device = peripheral;
    //    var data = new Uint8Array(1);
    //    data[0] = 1;
    //    console.log('BLEDetail - device:', JSON.stringify(peripheral, null, 4));
    //    console.log('BLEDetail - writing data');
    //    ble.write(peripheral.id, SERVICE, CHAR_RXTX, data, function() {
    //      console.log('success');
    //      console.log('BLEDetail - device:', JSON.stringify(peripheral, null, 4));
    //    }, function() { console.log('fail'); });
    //
    //  }
    //);
    console.log('Device', i, ':', JSON.stringify($stateParams, null, 4));
    $scope.device = $stateParams.deviceId;
    BLE.newConnect($stateParams.deviceId);

    $scope.btWrite = function(msg) {
      bluetoothSerial.write(msg);
      console.log('wrote:', msg);
    };
  })

  .controller('AccountCtrl', function ($scope) {
    $scope.settings = {
      enableFriends: true
    };
  });

