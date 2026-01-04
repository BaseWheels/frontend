import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { usePrivy, useWallets } from '@privy-io/react-auth'

function App() {
  const {
    ready,
    authenticated,
    user,
    login,
    logout,
    createWallet
  } = usePrivy();

  const { wallets } = useWallets();

  // Tunggu sampai Privy ready
  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Privy Auth Test</h1>

      <div className="card">
        {/* Status Login */}
        <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Status:</h3>
          <p>Authenticated: {authenticated ? '✅ Yes' : '❌ No'}</p>
          <p>Ready: {ready ? '✅ Yes' : '⏳ Loading'}</p>
        </div>

        {/* Tombol Login/Logout */}
        {!authenticated ? (
          <button onClick={login}>
            🔐 Login
          </button>
        ) : (
          <button onClick={logout}>
            🚪 Logout
          </button>
        )}

        {/* Info User (jika sudah login) */}
        {authenticated && user && (
          <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #4CAF50', borderRadius: '8px', textAlign: 'left' }}>
            <h3>👤 User Info:</h3>
            <p><strong>User ID:</strong> {user.id}</p>

            {user.email && (
              <p><strong>Email:</strong> {user.email.address}</p>
            )}

            {user.google && (
              <p><strong>Google:</strong> {user.google.email}</p>
            )}

            {user.twitter && (
              <p><strong>Twitter:</strong> @{user.twitter.username}</p>
            )}

            <h4>💰 Wallets:</h4>
            {wallets.length > 0 ? (
              <ul style={{ textAlign: 'left' }}>
                {wallets.map((wallet, index) => (
                  <li key={index}>
                    <strong>Type:</strong> {wallet.walletClientType} <br />
                    <strong>Address:</strong> {wallet.address}
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                <p>No wallet yet</p>
                <button onClick={createWallet} style={{ marginTop: '10px' }}>
                  ➕ Create Wallet
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default App
