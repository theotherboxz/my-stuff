export const JSONBIN_API_KEY = "2a10$2q1u.CPU6pOArUxy5vaaP.N191sa.CU/OCjcKwnns3Ub9uYM048mq";
export const JSONBIN_BASE_URL = "https://api.jsonbin.io/v3/b";

export async function createBin(encryptedData: string): Promise<string> {
  const response = await fetch(JSONBIN_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': JSONBIN_API_KEY,
      'X-Bin-Private': 'true',
      'X-Bin-Name': 'VaultData'
    },
    body: JSON.stringify({ vault: encryptedData })
  });

  if (!response.ok) {
    throw new Error('Failed to create bin');
  }

  const data = await response.json();
  return data.metadata.id;
}

export async function updateBin(binId: string, encryptedData: string): Promise<void> {
  const response = await fetch(`${JSONBIN_BASE_URL}/${binId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': JSONBIN_API_KEY
    },
    body: JSON.stringify({ vault: encryptedData })
  });

  if (!response.ok) {
    throw new Error('Failed to update bin');
  }
}

export async function readBin(binId: string): Promise<string> {
  const response = await fetch(`${JSONBIN_BASE_URL}/${binId}/latest`, {
    method: 'GET',
    headers: {
      'X-Master-Key': JSONBIN_API_KEY
    }
  });

  if (!response.ok) {
    throw new Error('Failed to read bin');
  }

  const data = await response.json();
  return data.record.vault;
}
