/* Copyright (c) Richard Wall
 * See LICENSE for details.
 *
 * Some example recipes for Collectd RRD data - you *will* need to modify this
 * based on the RRD data available on your system.
 */

if(typeof(jarmon) === 'undefined') {
    var jarmon = {};
}


jarmon.TAB_RECIPES_STANDARD = [
    ['System',      ['cpu', 'memory','load']],
    ['Network',     ['eth0', 'eth7']],
    ['Processes',     ['qemu-kvm', 'vhosts', 'events']]
];

jarmon.CHART_RECIPES_COLLECTD = {
    'cpu': {
        title: 'CPU Average',
        data: [
            ['data/KVM-HSVG8-A/aggregation-cpu-average/cpu-system.rrd', 0, 'CPU System', '%'],
            ['data/KVM-HSVG8-A/aggregation-cpu-average/cpu-user.rrd', 0, 'CPU User', '%'],
            ['data/KVM-HSVG8-A/aggregation-cpu-average/cpu-wait.rrd', 0, 'CPU User', '%']
        ],
        options: jQuery.extend(true, {}, jarmon.Chart.BASE_OPTIONS,
                                         jarmon.Chart.STACKED_OPTIONS)
    },

    'memory': {
        title: 'Memory',
        data: [
            ['data/KVM-HSVG8-A/memory/memory-buffered.rrd', 0, 'Buffered', 'B'],
            ['data/KVM-HSVG8-A/memory/memory-used.rrd', 0, 'Used', 'B'],
            ['data/KVM-HSVG8-A/memory/memory-cached.rrd', 0, 'Cached', 'B'],
            ['data/KVM-HSVG8-A/memory/memory-free.rrd', 0, 'Free', 'B']
        ],
        options: jQuery.extend(true, {}, jarmon.Chart.BASE_OPTIONS,
                                         jarmon.Chart.STACKED_OPTIONS)
    },

    'load': {
        title: 'Load Average',
        data: [
            ['data/KVM-HSVG8-A/load/load.rrd', 'shortterm', 'Short Term', ''],
            ['data/KVM-HSVG8-A/load/load.rrd', 'midterm', 'Medium Term', ''],
            ['data/KVM-HSVG8-A/load/load.rrd', 'longterm', 'Long Term', '']
        ],
        options: jQuery.extend(true, {}, jarmon.Chart.BASE_OPTIONS)
    },

    'eth0': {
        title: 'eth0 Throughput',
        data: [
            ['data/KVM-HSVG8-A/interface-eth0/if_octets.rrd', 'tx', 'Transmit', 'bit/s', function (v) { return v*8; }],
            ['data/KVM-HSVG8-A/interface-eth0/if_octets.rrd', 'rx', 'Receive', 'bit/s', function (v) { return v*8; }]
        ],
        options: jQuery.extend(true, {}, jarmon.Chart.BASE_OPTIONS)
    },

    'eth7': {
        title: 'eth7 Throughput',
        data: [
            ['data/KVM-HSVG8-A/interface-eth7/if_octets.rrd', 'tx', 'Transmit', 'bit/s', function (v) { return v*8; }],
            ['data/KVM-HSVG8-A/interface-eth7/if_octets.rrd', 'rx', 'Receive', 'bit/s', function (v) { return v*8; }]
        ],
        options: jQuery.extend(true, {}, jarmon.Chart.BASE_OPTIONS)
    },

    'qemu-kvm': {
        title: 'QEMU-KVM processes',
        data: [
            ['data/KVM-HSVG8-A/processes-qemu-kvm/ps_cputime.rrd', 'user', 'User', 'Time'],
            ['data/KVM-HSVG8-A/processes-qemu-kvm/ps_cputime.rrd', 'syst', 'System', 'Time']
        ],
        options: jQuery.extend(true, {}, jarmon.Chart.BASE_OPTIONS)
    },

    'vhosts': {
        title: 'vhost processes',
        data: [
            ['data/KVM-HSVG8-A/processes-vhost/ps_cputime.rrd', 'user', 'User', 'Time'],
            ['data/KVM-HSVG8-A/processes-vhost/ps_cputime.rrd', 'syst', 'System', 'Time']
        ],
        options: jQuery.extend(true, {}, jarmon.Chart.BASE_OPTIONS)
    },

    'events': {
        title: 'events processing',
        data: [
            ['data/KVM-HSVG8-A/processes-events/ps_cputime.rrd', 'user', 'User', 'Time'],
            ['data/KVM-HSVG8-A/processes-events/ps_cputime.rrd', 'syst', 'System', 'Time']
        ],
        options: jQuery.extend(true, {}, jarmon.Chart.BASE_OPTIONS)
    }

};
