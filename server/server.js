const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/database');
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.post('/api/subscribe', async (req, res) => {
    try {
        const { name, email, language } = req.body;
        const user = new User({
            name,
            email,
            language,
            subscribed: true
        });
        await user.save();
        res.status(201).json({ message: 'Successfully subscribed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Memory Graph Implementation
const memoryGraph = {
    nodes: new Map(),
    edges: new Map(),
    
    addNode(id, data) {
        this.nodes.set(id, { id, data, connections: new Set() });
    },
    
    addEdge(fromId, toId, relationship) {
        const from = this.nodes.get(fromId);
        const to = this.nodes.get(toId);
        
        if (from && to) {
            from.connections.add({ to: toId, relationship });
            this.edges.set(`${fromId}-${toId}`, { from: fromId, to: toId, relationship });
        }
    },
    
    getNode(id) {
        return this.nodes.get(id);
    },
    
    getConnections(id) {
        const node = this.nodes.get(id);
        return node ? Array.from(node.connections) : [];
    }
};

// Memory Graph API Routes
app.post('/api/memory/node', (req, res) => {
    const { id, data } = req.body;
    memoryGraph.addNode(id, data);
    res.json({ message: 'Node added successfully' });
});

app.post('/api/memory/edge', (req, res) => {
    const { fromId, toId, relationship } = req.body;
    memoryGraph.addEdge(fromId, toId, relationship);
    res.json({ message: 'Edge added successfully' });
});

app.get('/api/memory/node/:id', (req, res) => {
    const node = memoryGraph.getNode(req.params.id);
    if (node) {
        res.json(node);
    } else {
        res.status(404).json({ message: 'Node not found' });
    }
});

app.get('/api/memory/connections/:id', (req, res) => {
    const connections = memoryGraph.getConnections(req.params.id);
    res.json(connections);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 