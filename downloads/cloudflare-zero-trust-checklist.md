# Cloudflare Zero Trust Setup Checklist

- [ ] **1. Prep Cloudflare Account:** Ensure your domain is using Cloudflare's nameservers and DNS is resolving.
- [ ] **2. Enable Zero Trust:** Navigate to the Zero Trust dashboard and enable the free tier.
- [ ] **3. Install `cloudflared`:** Install the Cloudflare tunnel daemon on your local home server or VM.
- [ ] **4. Authenticate Tunnel:** Run `cloudflared tunnel login` and authenticate with your account.
- [ ] **5. Create Tunnel:** Run `cloudflared tunnel create <tunnel-name>`.
- [ ] **6. Map Local Services:** Create a `config.yml` mapping your local IP/ports (e.g., `http://192.168.1.50:80`) to your subdomains (e.g., `app.yourdomain.com`).
- [ ] **7. Route DNS:** Run `cloudflared tunnel route dns <tunnel-name> <subdomain>`.
- [ ] **8. Start the Tunnel:** Run `cloudflared tunnel run <tunnel-name>` to verify connectivity.
- [ ] **9. Run as a Service:** Install the tunnel as a system service (`cloudflared service install`) so it starts on boot.
- [ ] **10. Add Access Policies (Optional):** In the Zero Trust dashboard, go to Access -> Applications and enforce One-Time PIN (OTP) email verification for sensitive endpoints.
