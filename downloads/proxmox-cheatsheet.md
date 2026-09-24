# Proxmox VE Rookie Command Cheatsheet

## LXC Container Management (pct)
- `pct list` - List all containers and their status.
- `pct start <vmid>` - Start a container.
- `pct stop <vmid>` - Stop a container gracefully.
- `pct enter <vmid>` - Enter a container's shell (like SSH, but direct).
- `pct exec <vmid> -- <command>` - Run a command inside the container without entering it.
- `pct df <vmid>` - Check disk usage for a container.

## Virtual Machine Management (qm)
- `qm list` - List all VMs.
- `qm start <vmid>` - Start a VM.
- `qm shutdown <vmid>` - Gracefully shut down a VM.
- `qm stop <vmid>` - Forcefully stop a VM (pull the power plug).
- `qm clone <vmid> <newid> --name <newname>` - Clone a VM.

## Cluster & Node Health
- `pvecm status` - View cluster quorum and node status.
- `pveversion -v` - Show detailed version info for Proxmox and packages.
- `systemctl status pve-cluster` - Check the Proxmox cluster file system service.

## Network & Storage
- `pvesm status` - List all configured storage pools and their usage.
- `ip a` - View network interfaces and IPs.

## Updates
- `apt update && apt dist-upgrade -y` - Safely update Proxmox VE (never use standard `apt upgrade`).
