import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Dexie from "dexie";
import "./formulario.css";

export function Formulario() {
  const notifySuccess = () => toast.success("Peça adicionada com sucesso!");
  const notifyError = () => toast.error("Erro ao adicionar a peça!");
  const notifyAtualiza = () => toast.success("Peça atualizada com sucesso!");
  const notifyRemove = () => {
    toast.custom((t) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#FF4C4C",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
          color: "white",
        }}
      >
        <div style={{ marginRight: "10px", fontSize: "16px" }}>🗑️</div>
        <div>
          <strong>Peça removida com sucesso!</strong>
        </div>
      </div>
    ));
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const [pecas, setPecas] = useState([]);
  const [filteredPecas, setFilteredPecas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMaquina, setSelectedMaquina] = useState("");
  const [isRetrabalho, setIsRetrabalho] = useState("");

  const db = new Dexie("FosfatoDatabase");
  db.version(1).stores({
    pecas:
      "++id, codigo, lote, quantidade, data, hora, maquina, retrabalho, motivo",
  });

  useEffect(() => {
    atualizarListaPecas();
  }, [atualizarListaPecas]);

  useEffect(() => {
    filterPecas();
  }, [searchTerm, selectedMaquina, isRetrabalho, pecas]);

  function atualizarListaPecas() {
    db.pecas.toArray().then((pecas) => {
      setPecas(pecas);
    });
  }

  function filterPecas() {
    const filtered = pecas.filter((peca) => {
      const matchesCodigo = peca.codigo
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesMaquina = selectedMaquina
        ? peca.maquina === selectedMaquina
        : true;
      const matchesRetrabalho = isRetrabalho
        ? peca.retrabalho.toString() === isRetrabalho
        : true;
      return matchesCodigo && matchesMaquina && matchesRetrabalho;
    });
    setFilteredPecas(filtered);
  }

  function onSubmit(data) {
    const peca = {
      ...data,
      codigo: "BR" + data.codigo,
      retrabalho: data.retrabalho === "true",
    };

    if (editingId === null) {
      db.pecas
        .add(peca)
        .then(() => {
          console.log("Peça adicionada com sucesso");
          notifySuccess();
          atualizarListaPecas();
        })
        .catch((error) => {
          console.error("Erro ao adicionar peça:", error);
          notifyError();
        });
    } else {
      db.pecas
        .update(editingId, peca)
        .then(() => {
          console.log("Peça atualizada com sucesso");
          setEditingId(null);
          reset();
          notifyAtualiza();
          atualizarListaPecas();
        })
        .catch((error) => {
          console.error("Erro ao atualizar peça:", error);
          notifyError();
        });
    }
    reset();
  }

  function removerPeca(id) {
    db.pecas.delete(id).then(() => {
      console.log("Peça removida com sucesso");
      notifyRemove();
      atualizarListaPecas();
    });
  }

  function alterarPeca(peca) {
    setEditingId(peca.id);
    reset(peca);
  }

  const retrabalhoValue = watch("retrabalho");

  return (
    <Container className="forms mt-5 border border-dark shadow border-2 p-5 ">
      <Toaster />
      <h1 className="text-center">FOSFATO 1136 - Cadastro de Peças</h1>
      <hr />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3 mt-5">
          <Form.Label>Código da Peça:</Form.Label>
          <InputGroup>
            <InputGroup.Text>BR</InputGroup.Text>
            <Form.Control
              type="text"
              isInvalid={!!errors.codigo}
              {...register("codigo", { required: "Código é obrigatório!" })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.codigo?.message}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Lote:</Form.Label>
          <Form.Control
            type="text"
            isInvalid={!!errors.lote}
            {...register("lote", { required: "Lote é obrigatório!" })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.lote?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Quantidade:</Form.Label>
          <Form.Control
            type="number"
            min="1"
            isInvalid={!!errors.quantidade}
            {...register("quantidade", {
              required: "Quantidade é obrigatória!",
            })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.quantidade?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Data:</Form.Label>
          <Form.Control
            type="date"
            isInvalid={!!errors.data}
            {...register("data", { required: "Data é obrigatória!" })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.data?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Hora:</Form.Label>
          <Form.Control
            type="time"
            isInvalid={!!errors.hora}
            {...register("hora", { required: "Hora é obrigatória!" })}
          />
          <Form.Control.Feedback type="invalid">
            {errors.hora?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Máquina:</Form.Label>
          <Form.Select
            value={selectedMaquina}
            onChange={(e) => setSelectedMaquina(e.target.value)}
          >
            <option value="">Selecione a máquina:</option>
            <option value="LFOS-0201">LFOS-0201</option>
            <option value="LFOS-0202">LFOS-0202</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Retrabalho"
            {...register("retrabalho")}
          />
        </Form.Group>

        {retrabalhoValue && (
          <Form.Group className="mb-3">
            <Form.Label>Motivo do Retrabalho</Form.Label>
            <Form.Control as="textarea" rows={3} {...register("motivo")} />
          </Form.Group>
        )}

        <Button type="submit" variant="success">
          {editingId ? "Atualizar Peça" : "Cadastrar Peça"}
        </Button>
      </Form>
      <hr className="mt-4" />

      <InputGroup className="mb-3">
        <FormControl
          placeholder="Pesquisar por Código"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>
      <Form.Group className="mb-2 mt-2">
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Filtrar por Máquina:</Form.Label>
              <Form.Select
                value={selectedMaquina}
                onChange={(e) => setSelectedMaquina(e.target.value)}
              >
                <option value="">Todas as Máquinas</option>
                <option value="LFOS-0201">LFOS-0201</option>
                <option value="LFOS-0202">LFOS-0202</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Filtrar por Retrabalho:</Form.Label>
              <Form.Select
                value={isRetrabalho}
                onChange={(e) => setIsRetrabalho(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Form.Group>

      <h2 className="mt-3 mb-3">Peças Cadastradas:</h2>
      {filteredPecas.map((peca) => (
        <div key={peca.id} className="border p-3 mb-2">
          <h5>Código: {peca.codigo}</h5>
          <p>Lote: {peca.lote}</p>
          <p>Quantidade: {peca.quantidade}</p>
          <p>Data: {peca.data}</p>
          <p>Hora: {peca.hora}</p>
          <p>Máquina: {peca.maquina}</p>
          <p>Retrabalho: {peca.retrabalho ? "Sim" : "Não"}</p>
          {peca.retrabalho && <p>Motivo: {peca.motivo}</p>}
          <Button variant="warning" onClick={() => alterarPeca(peca)}>
            Alterar
          </Button>{" "}
          <Button variant="danger" onClick={() => removerPeca(peca.id)}>
            Remover
          </Button>
        </div>
      ))}
    </Container>
  );
}
