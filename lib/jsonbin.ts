export const JSONBIN_API_KEY = "$2a$10$nBns4APaMiUiS/2xPaj0R.mzhsUCZZJ2RV/bfZrfYSB5HddOV8iFa";
export const JSONBIN_BASE_URL = "https://api.jsonbin.io/v3/b";

export async function createBin(encryptedData: string): Promise<string> {
  const response = await fetch(JSONBIN_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': JSONBIN_API_KEY,
      'X-Bin-Private': 'true',
      'X-Bin-Name': 'VaultData',
      'X-Bin-Versioning': 'false'
    },
    body: JSON.stringify({ vault: encryptedData })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create bin: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.metadata.id;
}

export async function updateBin(binId: string, encryptedData: string): Promise<void> {
  const response = await fetch(`${JSONBIN_BASE_URL}/${binId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': JSONBIN_API_KEY,
      'X-Bin-Versioning': 'false'
    },
    body: JSON.stringify({ vault: encryptedData })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update bin: ${response.status} ${response.statusText} - ${errorText}`);
  }
}

export async function readBin(binId: string): Promise<string> {
  const response = await fetch(`${JSONBIN_BASE_URL}/${binId}`, {
    method: 'GET',
    headers: {
      'X-Master-Key': JSONBIN_API_KEY
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to read bin: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.record.vault;
}
