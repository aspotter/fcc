import socket
import re

def get_open_ports(target, port_range, verbose = False):
    socket.setdefaulttimeout(5)
    open_ports = []

    try:
        for port in range(port_range[0], port_range[1] + 1):
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                if s.connect_ex((target, port)) == 0:
                    open_ports.append(port)

        if verbose == True:
            ip = socket.gethostbyname(target)
            try:
                url = socket.gethostbyaddr(ip)[0]
            except socket.herror:
                url = None

            if url == None:
                output = f'Open ports for {ip}\nPORT     SERVICE'
            else:
                output = f'Open ports for {url} ({ip})\nPORT     SERVICE'

            for port in open_ports:
                try:
                    service = socket.getservbyport(port)
                except OSError:
                    service = 'Unknown'
                output += f'\n{port:<9}{service}'
            return output
        else: 
            return(open_ports)

    except socket.gaierror:
        if re.search('[a-zA-Z]', target):
            return 'Error: Invalid hostname'
        else:
            return 'Error: Invalid IP address'
