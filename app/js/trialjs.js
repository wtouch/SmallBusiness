//define([], function () {
//return
[
			{
				name : "Staff",
				path : "#/dashboard/inventory/staff/",
				events : {
					click : function(){
						return $scope.openModal("modules/inventory/staff/addstaff.html");
					}
				}
			},
			{
				name : "Add Attendance",
				path : "#/dashboard/inventory/staff/",
				events : {
					click : function(){
						return $scope.openstaffattendance("modules/inventory/staff/staffattendence.html");
					}
				}
			},
			{
				name : "Add Leaves",
				path : "#/dashboard/inventory/staff/",
				events : {
					click : function(){
						return $scope.openAddleaves("modules/inventory/staff/addleaves.html");
					}
				}
			},
			{
				name : "Staff Payment",
				path : "#/dashboard/inventory/staff/",
				events : {
					click : function(){
						return $scope.openStaffpayment("modules/inventory/staff/staffpayment.html");
					}
				}
			},
			{
				name : "Holidays",
				path : "#/dashboard/inventory/staff/",
				events : {
					click : function(){
						return $scope.openAddholiday("modules/inventory/staff/addholidays.html");
					}
				}
			},
			
		]
//})