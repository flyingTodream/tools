const portsList = [
    { label: '7', value: 'Echo', color: '' },
    { label: '19', value: 'Chargen', color: '' },
    { label: '20-21', value: 'FTP', color: '' },
    { label: '22', value: 'SSH/SCP', color: '#668abc', isCommon: true },
    { label: '23', value: 'Telnet', color: '' },
    { label: '25', value: 'SMTP', color: '' },
    { label: '42', value: 'WINS Replication', color: '' },
    { label: '43', value: 'WHOIS', color: '' },
    { label: '49', value: 'TACACS', color: '' },
    { label: '53', value: 'DNS', color: '', isCommon: true },
    { label: '67-68', value: 'DHCP/BOOTP', color: '' },
    { label: '69', value: 'TFTP', color: '' },
    { label: '70', value: 'Gopher', color: '' },
    { label: '79', value: 'Finger', color: '' },
    { label: '80', value: 'HTTP', color: '', isCommon: true },
    { label: '88', value: 'Kerberos', color: '' },
    { label: '102', value: 'MS Exchange', color: '' },
    { label: '110', value: 'POP3', color: '' },
    { label: '113', value: 'Ident', color: '' },
    { label: '119', value: 'NNTP (Usenet)', color: '' },
    { label: '123', value: 'NTP', color: '' },
    { label: '135', value: 'MS RPC', color: '' },
    { label: '137-139', value: 'NetBIOS', color: '' },
    { label: '143', value: 'IMAP4', color: '' },
    { label: '161-162', value: 'SNMP', color: '' },
    { label: '177', value: 'XDMCP', color: '' },
    { label: '179', value: 'BGP', color: '' },
    { label: '201', value: 'AppleTalk', color: '' },
    { label: '264', value: 'BGMP', color: '' },
    { label: '318', value: 'TSP', color: '' },
    { label: '381-383', value: 'HP Openview', color: '' },
    { label: '389', value: 'LDAP', color: '' },
    { label: '411-412', value: 'Direct Connect', color: '#bc9866' },
    { label: '443', value: 'HTTP over SSL', color: '#668abc', isCommon: true },
    { label: '445', value: 'MS DS', color: '' },
    { label: '464', value: 'Kerberos', color: '' },
    { label: '465', value: 'SMTP over SSL', color: '#668abc' },
    { label: '497', value: 'Retrospect', color: '' },
    { label: '500', value: 'ISAKMP', color: '#668abc' },
    { label: '512', value: 'rexec', color: '' },
    { label: '513', value: 'rlogin', color: '' },
    { label: '514', value: 'syslog', color: '' },
    { label: '515', value: 'LPD/LPR', color: '' },
    { label: '520', value: 'RIP', color: '' },
    { label: '521', value: 'RIPng (IPv6)', color: '' },
    { label: '540', value: 'UUCP', color: '' },
    { label: '554', value: 'RTSP', color: '' },
    { label: '546-547', value: 'DHCPv6', color: '' },
    { label: '560', value: 'rmonitor', color: '' },
    { label: '563', value: 'NNTP OVER SSL', color: '#668abc' },
    { label: '587', value: 'SMTP', color: '' },
    { label: '591', value: 'FileMaker', color: '' },
    { label: '593', value: 'MS DCOM', color: '' },
    { label: '631', value: 'Internet Printing', color: '' },
    { label: '636', value: 'LDAP OVER SSL', color: '#668abc' },
    { label: '639', value: 'MSDP (PIM)', color: '' },
    { label: '646', value: 'LDP (MPLS)', color: '' },
    { label: '691', value: 'MS Exchange', color: '' },
    { label: '860', value: 'iSCSI', color: '' },
    { label: '873', value: 'rsync', color: '' },
    { label: '902', value: 'VMware Server', color: '' },
    { label: '989-990', value: 'FTP OVER SSL', color: '#668abc' },
    { label: '993', value: 'IMAP4 OVER SSL ', color: '#668abc' },
    { label: '995', value: 'POP3 OVER SSL', color: '#668abc' },
    { label: '1025', value: 'MS RPC', color: '' },
    { label: '1026-1029', value: 'Win Messenge', color: '' },
    { label: '1080', value: 'SOCKS PROXY  ', color: '' },
    { label: '1080', value: 'MyDoom', color: '#bc6674' },
    { label: '1194', value: 'OpenVPN', color: '' },
    { label: '1214', value: 'KAZAA', color: '#bc9866' },
    { label: '1241', value: 'Nessus', color: '' },
    { label: '1311', value: 'Dell OpenManage', color: '' },
    { label: '1337', value: 'WASTE', color: '#bc9866' },
    { label: '1433-1434', value: 'MS SQL', color: '' },
    { label: '1512', value: 'WINS', color: '' },
    { label: '1589', value: 'Cisco VQP', color: '' },
    { label: '1701', value: 'L2TP', color: '' },
    { label: '1723', value: 'MS PPTP', color: '' },
    { label: '1725', value: 'STEAM', color: '#66bc77' },
    { label: '1741', value: 'CiscoWorks 2000', color: '' },
    { label: '1755', value: 'MS MEDIA SERVER', color: '#dbde71' },
    { label: '1812-1813', value: 'RADIUS', color: '' },
    { label: '1863', value: 'MSN', color: '#b166bc' },
    { label: '1985', value: 'Cisco HSRP', color: '' },
    { label: '2000', value: 'Cisco SCCP', color: '' },
    { label: '2002', value: 'Cisco ACS', color: '' },
    { label: '2049', value: 'NFS', color: '' },
    { label: '2082-2083', value: 'cPanel', color: '' },
    { label: '2100', value: 'Oracle XDB', color: '' },
    { label: '2222', value: 'DirectAdmin', color: '' },
    { label: '2302', value: 'HALO ', color: '#66bc77' },
    { label: '2483-2484', value: 'Oracle DB', color: '' },
    { label: '2745', value: 'BAGLE.H', color: '#bc6674' },
    { label: '2967', value: 'Symantec AV', color: '' },
    { label: '3050', value: 'Interbase DB', color: '' },
    { label: '3074', value: 'XBOX LIVE', color: '#66bc77' },
    { label: '3124', value: 'HTTP Proxy', color: '' },
    { label: '3127', value: 'MYDOOM', color: '#bc6674' },
    { label: '3128', value: 'HTTP Proxy', color: '' },
    { label: '3222', value: 'GLBP', color: '' },
    { label: '3260', value: 'iSCSI Target', color: '' },
    { label: '3306', value: 'MySQL', color: '', isCommon: true },
    { label: '3389', value: 'Terminal Ser ver', color: '' },
    { label: '3689', value: 'iTunes', color: '' },
    { label: '3690', value: 'Subversion', color: '' },
    { label: '3724', value: 'World Of Warcraft', color: '#66bc77' },
    { label: '3784-3785', value: 'Ventrilo', color: '#dbde71' },
    { label: '4333', value: 'mSQL', color: '' },
    { label: '4444', value: 'BLASTER', color: '#bc6674' },
    { label: '4664', value: 'Google Desktop', color: '' },
    { label: '4672', value: 'EMULE', color: '#bc9866' },
    { label: '4899', value: 'Radmin', color: '' },
    { label: '5000', value: 'UPnP', color: '' },
    { label: '5001', value: 'Slingbox', color: '#dbde71' },
    { label: '5001', value: 'iperf', color: '' },
    { label: '5004-5005', value: 'RTP', color: '#dbde71' },
    { label: '5050', value: 'YAHOO! MESSENGER', color: '#b166bc' },
    { label: '5060', value: 'SIP', color: '#dbde71' },
    { label: '5190', value: 'AIM/ ICQ', color: '#b166bc' },
    { label: '5222-5223', value: 'XMPP/Jabber', color: '#b166bc' },
    { label: '5432', value: 'PostgreSQL', color: '' },
    { label: '5500', value: 'VNC Ser ver', color: '' },
    { label: '5554', value: 'SASSER', color: '#bc6674' },
    { label: '5631-5632', value: 'pcAnywhere', color: '' },
    { label: '5800', value: 'VNC over HTTP', color: '' },
    { label: '5900+', value: 'VNC Server', color: '' },
    { label: '6000-6001', value: 'X11', color: '' },
    { label: '6112', value: 'BATTLE.NET', color: '#66bc77' },
    { label: '6129', value: 'DameWare', color: '' },
    { label: '6257', value: 'WINMX', color: '#bc9866' },
    { label: '6346-6347', value: 'GNUTELLA', color: '#bc9866' },
    { label: '6500', value: 'GAMESPY ARCADE', color: '#66bc77' },
    { label: '6566', value: 'SANE', color: '' },
    { label: '6588', value: 'AnalogX', color: '' },
    { label: '6665-6669', value: 'IRC', color: '#b166bc' },
    { label: '6679/6697', value: 'IRC OVER SSL', color: '#b166bc' },
    { label: '6699', value: 'NAPSTER', color: '#bc9866' },
    { label: '6881-6999', value: 'BITTORRENT', color: '#bc9866' },
    { label: '6891-6901', value: 'WINDOWS LIVE', color: '#b166bc' },
    { label: '6970', value: 'Quicktime', color: '#dbde71' },
    { label: '7212', value: 'GhostSurf', color: '' },
    { label: '7648-7649', value: 'CU-SEEME', color: '#b166bc' },
    { label: '8000', value: 'Internet Radio', color: '#dbde71' },
    { label: '8080', value: 'HTTP Proxy', color: '', isCommon: true },
    { label: '8086-8087', value: 'Kaspersky AV', color: '' },
    { label: '8118', value: 'Privoxy', color: '' },
    { label: '8200', value: 'VMware Serve', color: '' },
    { label: '8500', value: 'Adobe ColdFusion', color: '' },
    { label: '8767', value: 'TEAMSPEAK', color: '#b166bc' },
    { label: '8866', value: 'BAGLE.B', color: '#bc6674' },
    { label: '9100', value: 'HP JetDirect', color: '' },
    { label: '9101-9103', value: 'Bacula', color: '' },
    { label: '9119', value: 'MXIT', color: '#b166bc' },
    { label: '9800', value: 'WebDAV', color: '' },
    { label: '9898', value: 'DABBER', color: '#bc6674' },
    { label: '9988', value: 'RBOT /SPYBOT', color: '#bc6674' },
    { label: '9999', value: 'Urchin', color: '' },
    { label: '10000', value: 'Webmin', color: '' },
    { label: '10000', value: 'BackupExec', color: '' },
    { label: '10113-10116', value: 'NetIQ', color: '' },
    { label: '11371', value: 'OpenPGP', color: '' },
    { label: '12035-12036', value: 'SECOND LIFE', color: '#66bc77' },
    { label: '12345', value: 'NETBUS', color: '#bc6674' },
    { label: '13720-13721', value: 'NetBackup', color: '' },
    { label: '14567', value: 'BATTLE FIELD', color: '#66bc77' },
    { label: '15118', value: 'DIPNET /ODDBOB', color: '#66bc77' },
    { label: '19226', value: 'AdminSecure', color: '' },
    { label: '19638', value: 'Ensim', color: '' },
    { label: '20000', value: 'Usermin', color: '' },
    { label: '24800', value: 'Synergy', color: '#dbde71' },
    { label: '25999', value: 'X FIRE', color: '#b166bc' },
    { label: '27015', value: 'HALF-LI FE', color: '#66bc77' },
    { label: '27374', value: 'SUB7', color: '#bc6674' },
    { label: '28960', value: 'CALL OF DUTY', color: '#66bc77' },
    { label: '31337', value: 'BACK O R I FICE', color: '#bc6674' },
    { label: '33434+', value: 'traceroute', color: '' },
]
const uglyData: string[] = []
for (const port of portsList) {
    uglyData.push(port.label)
}
const isPorts = (text: string): boolean => {
    return uglyData.includes(text)
}

const commonPort: string[] = []
for (const port of portsList) {
    if (port.isCommon) {
        commonPort.push(port.label)
    }
}
const isCommonPorts = (text: string): boolean => {
    return commonPort.includes(text)
}
const legends = [
    { kind: 'Chat', color: '#b166bc' },
    { kind: 'Encrypted', color: '#668abc' },
    { kind: 'Gaming', color: '#66bc77' },
    { kind: 'Malicious', color: '#bc6674' },
    { kind: 'Peer To Peer', color: '#bc9866' },
    { kind: 'Streaming', color: '#dbde71' },
]
export { portsList, legends, isPorts, isCommonPorts }
