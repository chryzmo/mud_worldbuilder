const API_BASE = 'http://127.0.0.1:8080';

export async function fetchNodeData() {
    try {
        const response = await fetch(`${API_BASE}/api/nodes`);
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

export async function fetchEdgeData() {
    try {
        const response = await fetch(`${API_BASE}/api/edges`);
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

export async function createNodeData(
    name: string,
    description: string,
    exitJSON: string
): Promise<{ id: number } | undefined> {
    try {
        const response = await fetch(`${API_BASE}/api/nodes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Name: name, Description: description, ExitJSON: exitJSON }),
        });
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

export async function saveNodeData(
    id: string,
    name: string,
    description: string,
    exitJSON: string
): Promise<void> {
    try {
        await fetch(`${API_BASE}/api/nodes`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, Name: name, Description: description, ExitJSON: exitJSON }),
        });
    } catch (error) {
        console.error(error);
    }
}

export async function deleteNodeData(id: string): Promise<void> {
    try {
        await fetch(`${API_BASE}/api/nodes?id=${encodeURIComponent(id)}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error(error);
    }
}
