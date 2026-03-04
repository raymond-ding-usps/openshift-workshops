var EIRMaintReportUtils = Class.create();
EIRMaintReportUtils.prototype = {
	maxRecursionDepth: 5,
	currentRecursionDepth: 0,

	initialize: function () {},

	exportToCsv: function () {
		gs.include("moment.2.24.0.js");

		var csvContent = "";

		// add header row
		csvContent += '"eirIndexNumber","eirName","eirAcronym","eirStatus"';
		csvContent +=
			',"Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"';

		// retrieve maintenance data
		var jsonContent = this.getJSON();

		// process maintenance schedule for each eir
		for (var eirIndex in jsonContent) {
			var eirEntry = jsonContent[eirIndex];

			// add data rows
			var rowContent = "";
			rowContent += '"' + eirEntry.eirIndexNumber + '",';
			rowContent += '"' + eirEntry.eirName + '",';
			rowContent += '"' + eirEntry.eirAcronym + '",';
			rowContent += '"' + eirEntry.eirStatus + '",';

			var schedArray = ['""', '""', '""', '""', '""', '""', '""'];
			for (var sIndex in eirEntry.scheduleEntries) {
				var sItem = eirEntry.scheduleEntries[sIndex];

				if (sItem.start_date_time != "" && sItem.end_date_time != "") {
					var startDate = moment(
						sItem.start_date_time,
						"YYYY-MM-DD hh:mm:ss A"
					);
					var endDate = moment(sItem.end_date_time, "YYYY-MM-DD hh:mm:ss A");

					var dateString =
						startDate.format("hh:mm A") + " - " + endDate.format("hh:mm A");

					// are start end on same day or two separate days?
					if (!moment(startDate).isSame(endDate, "day")) {
						dateString +=
							" (" + moment().day(sItem.days_of_week).format("ddd") + ")";
					}
					dateString = '"' + dateString + '"';

					schedArray[sItem.days_of_week - 1] = dateString;
				}
			}

			rowContent += schedArray.toString();
			csvContent += "\n" + rowContent;
		}
		return csvContent;
	},

	getJSON: function (active) {
		var eirRecords = this._getEirDetailed(active);
		var k = 0;

		eirRecords.forEach(function (eir) {
			var children = [];
			var schedule = {};

			var grCiRelationship = new GlideRecord("cmdb_rel_ci");
			grCiRelationship.addQuery("parent", eir.eirSysId.toString());
			grCiRelationship.addQuery("type", "55c95bf6c0a8010e0118ec7056ebc54d");  //  CMDB Relationship type "Contains::Contained By"
			grCiRelationship.query();

			while (grCiRelationship.next()) {
				var cmdbChild = grCiRelationship.getValue("child");
				children.push(cmdbChild);
			}

			if (children.length === 0) {
				eirRecords[k++].scheduleEntries = [];
				return;
			}

			var grServiceOffering = new GlideRecord("service_offering_commitment");
			grServiceOffering.addQuery("service_offering","IN",children.toString());
			grServiceOffering.addQuery("service_commitment.name","IN","Maintenance Window");
			grServiceOffering.orderBy("service_commitment.name");
			grServiceOffering.query();

			while (grServiceOffering.next()) {
				var grSchedule = new GlideRecord("cmn_schedule");

				if (grSchedule.get(grServiceOffering.service_commitment.schedule.toString())) {
					schedule.name = grServiceOffering.service_commitment.name.toString();  //  Use Service Commitment Name for the schedule name
					schedule.service_commitment = grServiceOffering.service_commitment.toString();
					schedule.sys_id = grSchedule.getValue("sys_id");
					schedule.description = grSchedule.getDisplayValue("description");
				}
			}

			var eirSchedules = new EIRMaintSchedules();
			eirRecords[k++].scheduleEntries = schedule.sys_id ? eirSchedules.getScheduleData(schedule.sys_id.toString()) : [];
		});
		
		return eirRecords;
	},

	_getEirDetailed: function (active) {
		var eirEntries = [];
		var grEirEntries = new GlideRecord("u_business_application_detail");
		if (active) {
			grEirEntries.addEncodedQuery('u_status!=41e4c54adb577fcc329370131f96196b^u_status!=01e4c54adb577fcc329370131f96196c'); // All EIRs which are not Removed or Retired
		}
		grEirEntries.orderBy('u_index_number');
		grEirEntries.query();
		
		while (grEirEntries.next()) {
			var eirEntryData = {};
			eirEntryData.eirName = grEirEntries.getDisplayValue("u_eir");
			eirEntryData.eirSysId = grEirEntries.getValue("u_eir");
			eirEntryData.eirIndexNumber = grEirEntries.getValue("u_index_number");
			eirEntryData.eirAcronym = grEirEntries.getValue("u_acronym");
			eirEntryData.eirStatus = grEirEntries.getDisplayValue("u_status");

			eirEntries.push(eirEntryData);
		}
		
		return eirEntries;
	},

	type: "EIRMaintReportUtils",
};
