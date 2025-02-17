let relayStore = {}; // Temporary in-memory storage

export default function handler(req, res) {
    const { method } = req;

    if (method === "POST") {
        const { code, type, sdp, iceCandidates } = req.body;
        if (!code || !type || (!sdp && !iceCandidates)) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (!relayStore[code]) {
            relayStore[code] = { offer: null, answer: null, iceCandidates: [] };
        }

        if (type === "offer") {
            relayStore[code].offer = { sdp, timestamp: Date.now() };
        } else if (type === "answer") {
            relayStore[code].answer = { sdp, timestamp: Date.now() };
        } else if (type === "ice") {
            relayStore[code].iceCandidates.push(...iceCandidates);
        }

        return res.status(200).json({ message: "Stored successfully" });
    }

    if (method === "GET") {
        const { code } = req.query;
        if (!code || !relayStore[code]) {
            return res.status(404).json({ error: "Code not found" });
        }
        return res.status(200).json(relayStore[code]);
    }

    if (method === "DELETE") {
        const { code } = req.body;
        if (!code || !relayStore[code]) {
            return res.status(404).json({ error: "Code not found" });
        }
        delete relayStore[code];
        return res.status(200).json({ message: "Deleted successfully" });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}



// let relayStore = {}; // Temporary in-memory storage

// export default function handler(req, res) {
//     const { method } = req;

//     if (method === "POST") {
//         const { code, ip, port } = req.body;
//         if (!code || !ip || !port) {
//             return res.status(400).json({ error: "Missing required fields" });
//         }
//         relayStore[code] = { ip, port, timestamp: Date.now() };
//         return res.status(200).json({ message: "Registered successfully" });
//     }

//     if (method === "GET") {
//         const { code } = req.query;
//         if (!code || !relayStore[code]) {
//             return res.status(404).json({ error: "Code not found" });
//         }
//         return res.status(200).json(relayStore[code]);
//     }

//     if (method === "DELETE") {
//         const { code } = req.body;
//         if (!code || !relayStore[code]) {
//             return res.status(404).json({ error: "Code not found" });
//         }
//         delete relayStore[code];
//         return res.status(200).json({ message: "Deleted successfully" });
//     }

//     return res.status(405).json({ error: "Method Not Allowed" });
// }
