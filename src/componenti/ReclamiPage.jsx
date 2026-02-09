import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

function ReclamiPage() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Definizione colonne DataGrid
  const columns = [
    { field: "NumReclamo", headerName: "Num Reclamo", width: 150 },
    { field: "nome", headerName: "Nome", width: 150 },
    { field: "cognome", headerName: "Cognome", width: 150 },
    { field: "codFiscale", headerName: "Codice Fiscale", width: 160 },
    { field: "ragioneSociale", headerName: "Ragione Sociale", width: 200 },
    { field: "pIVA", headerName: "P. IVA", width: 130 },
  ];

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://percipio.onrender.com/api/reclami/search?q=${encodeURIComponent(
          query
        )}`
      );
      if (!res.ok) throw new Error("Errore nella chiamata API");
      const json = await res.json();

      // Trasformo i dati in formato DataGrid
      const rows = json.map((r) => ({
        id: r._id,
        NumReclamo: r.NumReclamo,
        nome: r.personaFisica?.[0]?.nome || "-",
        cognome: r.personaFisica?.[0]?.cognome || "-",
        codFiscale: r.personaFisica?.[0]?.codFiscale || "-",
        ragioneSociale: r.personaGiuridica?.[0]?.ragioneSociale || "-",
        pIVA: r.personaGiuridica?.[0]?.pIVA || "-",
      }));

      setData(rows);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Esegue la ricerca alla pressione di Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") search();
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Ricerca Reclami
      </Typography>

      {/* Filtri */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >
        <TextField
          label="Testo di ricerca"
          variant="outlined"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button variant="contained" onClick={search}>
          Cerca
        </Button>
      </Paper>

      {/* Stato */}
      {loading && <Typography>Caricamento…</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {/* Tabella */}
      <Paper sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={data}
          columns={columns}
          loading={loading}
          initialState={{
          pagination: {
            paginationModel: {
                pageSize: 10,
                page: 0,
            },
          },
        }}
        pageSizeOptions={[10, 25, 50]}
        sx={{
            "& .MuiDataGrid-columnHeaders": { 
              backgroundColor: "#f5f5f5" },
              position: "sticky",
              top: 0,
              zIndex: 1,
          }}
        />
      </Paper>
    </Box>
  );
}

export default ReclamiPage;