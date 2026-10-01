# SecureDrop

I got tired of file-sharing tools asking for my email or phone number just to send a file. SecureDrop fixes that. You upload a file, get a 6-digit OTP, and share the code with whoever needs the file. They enter the OTP on their end and download it—no personal info involved.

## Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js & Express
- **Database & Storage**: Supabase

## Installation

Clone the repository and install the dependencies for both the server and client:

```bash
git clone https://github.com/your-username/SecureDrop.git
cd SecureDrop

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

Next, create a `.env` file inside the `server` directory (you can copy `example.env` as a base):

```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_supabase_secret_key
OTP_LOOKUP_SECRET=your_otp_lookup_secret
```

## Usage

Start the backend server:

```bash
cd server
npm run dev
```

In another terminal, start the React frontend:

```bash
cd client
npm run dev
```

Open `http://localhost:5173` in your browser.

- **To Share**: Click **Upload File**, select a file, and get your 6-digit OTP code.
- **To Receive**: Click **Download File**, enter the 6-digit OTP code, and download the file.

## Limitations & What's Next

- Need to add rate-limiting on OTP verification attempts to prevent brute-forcing.
- Upload limits are currently bound by default Supabase and Multer limits.

## License

MIT
