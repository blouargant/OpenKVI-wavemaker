/* Copyright (c) Richard Wall
 * See LICENSE for details.
 *
 * Some example recipes for Collectd RRD data - you *will* need to modify this
 * based on the RRD data available on your system.
 */

if(typeof(jarmon) === 'undefined') {
	var jarmon = {};
}

getQueryVar = function (name, defVal) {
	"use strict";
	var re = new RegExp('.*[?&]' + name + '=([^&#]*)'),
		match = document.location.href.match(re);
	if (typeof defVal === 'undefined') { defVal = null; }
	if (match) {
		return decodeURIComponent(match[1]);
	} else {
		return defVal;
	}
};



var id = getQueryVar('id', window.location.id);
var conf_var = getQueryVar('conf', window.location.host);
var conf = JSON.parse(conf_var);

var CPU_LIST = [];
for (var i = 0; i < conf.cpus; i++) {
	CPU_LIST[CPU_LIST.length] = 'cpu-'+i.toString();
}

var ETH_LIST = [];
for (i = 0; i < conf.eth; i++) {
	ETH_LIST[ETH_LIST.length] = 'eth'+i.toString();
}

jarmon.TAB_RECIPES_STANDARD = [
	['Overview',  ['cpu', 'memory','load']],
	['Processors', CPU_LIST],
	['Networking', ETH_LIST]
];

if (conf.qemukvm) {
	jarmon.TAB_RECIPES_STANDARD[jarmon.TAB_RECIPES_STANDARD.length] = 
		//[ 'KVM Guests', ['nb-process', 'cpu-time', 'pmem', 'disk_ops']]
		[ 'KVM Guests', ['nb-process', 'cpu-time', 'disk-ops']]
}


jarmon.CHART_RECIPES_COLLECTD = {
	'cpu': {
		title: 'CPU Average',
		data: [
			['data/'+conf.host+'/aggregation-cpu-average/cpu-wait.rrd', 0, 'CPU Wait', '%'],
			['data/'+conf.host+'/aggregation-cpu-average/cpu-system.rrd', 0, 'CPU System', '%'],
			['data/'+conf.host+'/aggregation-cpu-average/cpu-user.rrd', 0, 'CPU User', '%']
		],
		options: jQuery.extend(true, {}, jarmon.Chart.BASE_OPTIONS,
										 jarmon.Chart.STACKED_OPTIONS)
	},
	
	'memory': {
		title: 'Memory',
		data: [
			['data/'+conf.host+'/memory/memory-used.rrd', 0, 'Used', 'B'],
			['data/'+conf.host+'/memory/memory-buffered.rrd', 0, 'Buffered', 'B'],
			['data/'+conf.host+'/memory/memory-cached.rrd', 0, 'Cached', 'B'],
			['data/'+conf.host+'/memory/memory-free.rrd', 0, 'Free', 'B']
		],
		options: jQuery.extend(true, {}, jarmon.Chart.BASE_OPTIONS,
										 jarmon.Chart.STACKED_OPTIONS)
	},
	
	'load': {
		title: 'Load Average',
		data: [
			['data/'+conf.host+'/load/load.rrd', 'shortterm', 'Short Term', ''],
			['data/'+conf.host+'/load/load.rrd', 'midterm', 'Medium Term', ''],
			['data/'+conf.host+'/load/load.rrd', 'longterm', 'Long Term', '']
		],
		options: jQuery.extend(true, {}, jarmon.Chart.BASE_OPTIONS)
	}
};

for (var i = 0; i < conf.cpus; i++) {
	CPU = "cpu-"+i.toString();
	low_cpu= "cpu-"+i.toString();
	jarmon.CHART_RECIPES_COLLECTD[CPU] =
		    {
			title: 'CPU '+i.toString(),
				   data: [
				   ['data/'+conf.host+'/'+low_cpu+'/cpu-wait.rrd', 0, CPU+' Wait', '%'],
				   ['data/'+conf.host+'/'+low_cpu+'/cpu-system.rrd', 0, CPU+' System', '%'],
				   ['data/'+conf.host+'/'+low_cpu+'/cpu-user.rrd', 0, CPU+' User', '%']
				   ],
				   options: jQuery.extend(true, {}, jarmon.Chart.BASE_OPTIONS,
				                          jarmon.Chart.STACKED_OPTIONS)
			};
}

for (var i = 0; i < conf.eth; i++) {
	eth = "eth"+i.toString();
	jarmon.CHART_RECIPES_COLLECTD[eth] =
		    {
			title: eth+' Throughput',
			data: [
				['data/'+conf.host+'/interface-'+eth+'/if_octets.rrd', 'tx', 'Transmit', 'bit/s', function (v) { return v*8; }],
				['data/'+conf.host+'/interface-'+eth+'/if_octets.rrd', 'rx', 'Receive', 'bit/s', function (v) { return v*8; }]
			],
			options: jQuery.extend(true, {}, jarmon.Chart.BASE_OPTIONS)
			};
}


if (conf.qemukvm) {
	//[ 'KVM Guests', ['nb-process', 'cpu-time', 'pmem', 'disk-ops']]
	jarmon.CHART_RECIPES_COLLECTD['nb-process'] =
		    {
			title: 'Number of active guests',
				   data: [
				   ['data/'+conf.host+'/processes-qemu-kvm/ps_count.rrd', 'processes', 'Guests', '']
				   ],
				   options: jQuery.extend(true, {}, jarmon.Chart.BASE_OPTIONS)
			};
	jarmon.CHART_RECIPES_COLLECTD['cpu-time'] =
		    {
			title: 'CPU Time Share',
				   data: [
				   ['data/'+conf.host+'/processes-qemu-kvm/ps_cputime.rrd', 'syst', 'System', 's'],
				   ['data/'+conf.host+'/processes-qemu-kvm/ps_cputime.rrd', 'user', 'User', 's']
				   ],
				   options: jQuery.extend(true, {}, jarmon.Chart.BASE_OPTIONS,
				                          jarmon.Chart.STACKED_OPTIONS)
			};
	jarmon.CHART_RECIPES_COLLECTD['disk-ops'] =
		    {
			title: 'Disks usage',
				   data: [
				   ['data/'+conf.host+'/processes-qemu-kvm/ps_disk_ops.rrd', 'read', 'Reads', 'ops/s'],
				   ['data/'+conf.host+'/processes-qemu-kvm/ps_disk_ops.rrd', 'write', 'writes', 'ops/s']
				   ],
				   options: jQuery.extend(true, {}, jarmon.Chart.BASE_OPTIONS)
			};
}

/*
	'eth0': {
		title: 'eth0 Throughput',
		data: [
			['data/'+conf.host+'/interface-eth0/if_octets.rrd', 'tx', 'Transmit', 'bit/s', function (v) { return v*8; }],
			['data/'+conf.host+'/interface-eth0/if_octets.rrd', 'rx', 'Receive', 'bit/s', function (v) { return v*8; }]
		],
		options: jQuery.extend(true, {}, jarmon.Chart.BASE_OPTIONS)
	},

	'eth7': {
		title: 'eth7 Throughput',
		data: [
			['data/'+conf.host+'/interface-eth7/if_octets.rrd', 'tx', 'Transmit', 'bit/s', function (v) { return v*8; }],
			['data/'+conf.host+'/interface-eth7/if_octets.rrd', 'rx', 'Receive', 'bit/s', function (v) { return v*8; }]
		],
		options: jQuery.extend(true, {}, jarmon.Chart.BASE_OPTIONS)
	},

	'qemu-kvm': {
		title: 'QEMU-KVM processes',
		data: [
			['data/'+conf.host+'/processes-qemu-kvm/ps_cputime.rrd', 'user', 'User', 'Time'],
			['data/'+conf.host+'/processes-qemu-kvm/ps_cputime.rrd', 'syst', 'System', 'Time']
		],
		options: jQuery.extend(true, {}, jarmon.Chart.BASE_OPTIONS)
	},

	'vhosts': {
		title: 'vhost processes',
		data: [
			['data/'+conf.host+'/processes-vhost/ps_cputime.rrd', 'user', 'User', 'Time'],
			['data/'+conf.host+'/processes-vhost/ps_cputime.rrd', 'syst', 'System', 'Time']
		],
		options: jQuery.extend(true, {}, jarmon.Chart.BASE_OPTIONS)
	},

	'events': {
		title: 'events processing',
		data: [
			['data/'+conf.host+'/processes-events/ps_cputime.rrd', 'user', 'User', 'Time'],
			['data/'+conf.host+'/processes-events/ps_cputime.rrd', 'syst', 'System', 'Time']
		],
		options: jQuery.extend(true, {}, jarmon.Chart.BASE_OPTIONS)
	}
*/
