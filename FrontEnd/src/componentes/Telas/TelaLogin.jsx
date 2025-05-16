import React, { useContext, useState } from "react";
import "./TelaLogin.css";
import { ContextoUsuarioLogado } from "../../App";
import { login } from "../../servicos/loginService";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { registrar } from "../../servicos/usersService";
import logoImage from "../../assets/imagens/logoalsten.jpg";

export default function TelaLogin() {
  const contexto = useContext(ContextoUsuarioLogado);
  const [usuario, setUsuario] = useState({
    usuario: "",
    senha: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  function realizarLogin(evento) {
    evento.preventDefault();

    login(usuario.usuario, usuario.senha)
        .then((resposta) => {
            if (resposta?.status) {
                // Atualizar o estado global com os dados do usuário
                const usuarioLogado = {
                    id: resposta.id,
                    nome: resposta.nome,
                    email: resposta.email,
                    logado: true,
                    token: resposta.token,
                    role: resposta.role, // Certifique-se de usar o campo correto do backend
                };

                contexto.setUsuarioLogado(usuarioLogado);

                // Salvar no localStorage para persistência
                localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
            } else {
                alert(resposta.mensagem); // Mensagem de erro
            }
        })
        .catch((erro) => {
            alert("Erro ao realizar login: " + erro.message);
        });
}



function realizarCadastro(evento) {
    evento.preventDefault();

    const dadosCadastro = {
        nome: usuario.nome,
        email: usuario.usuario,
        password: usuario.senha,
        role_id: 3, // Por exemplo, definir um role padrão para o cadastro
    };

    registrar(dadosCadastro.nome, dadosCadastro.email, dadosCadastro.password, dadosCadastro.role_id)
        .then((resposta) => {
            if (resposta?.status) {
                alert("Usuário cadastrado com sucesso!");
                setIsSignUpMode(false); // Alternar para a tela de login
            } else {
                alert(resposta.mensagem);
            }
        })
        .catch((erro) => {
            alert("Erro ao registrar usuário: " + erro.message);
        });
}


  function manipularMudanca(evento) {
    const { name, value } = evento.target;
    setUsuario({ ...usuario, [name]: value });
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`login-page ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-login-page">
        <div className="signin-signup">
          {/* Formulário de Login */}
          <form onSubmit={realizarLogin} className="sign-in-form">
            <div className="text-center mb-4">
              <img src={logoImage} alt="Logo" className="img-fluid w-75" />
            </div>
              <div className="input-field">
              <FaUser className="icon" />
              <input
                type="text"
                placeholder="Usuário"
                name="usuario"
                value={usuario.usuario}
                onChange={manipularMudanca}
              />
            </div>
            <div className="input-field">
              <FaLock
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer" }}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                name="senha"
                value={usuario.senha}
                onChange={manipularMudanca}
              />
            </div>

            <input type="submit" value="Entrar" className="btn solid" />
          </form>

          {/* Formulário de Cadastro */}
          <form onSubmit={realizarCadastro} className="sign-up-form">
            <h2 className="title">Cadastre-se</h2>
            <div className="input-field">
                <FaUser />
                <input
                    type="text"
                    placeholder="Nome do Usuário"
                    name="nome"
                    value={usuario.nome || ""}
                    onChange={manipularMudanca}
                />
            </div>
            <div className="input-field">
                <FaEnvelope />
                <input
                    type="email"
                    placeholder="E-mail"
                    name="usuario"
                    value={usuario.usuario || ""}
                    onChange={manipularMudanca}
                />
            </div>
            <div className="input-field">
                <FaLock
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                />
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    name="senha"
                    value={usuario.senha || ""}
                    onChange={manipularMudanca}
                />
            </div>
            <input type="submit" className="btn" value="Cadastrar" />
        </form>

        </div>
      </div>

      {/* Painéis laterais */}
      <div className="panels-login-page">
        <div className="panel left-panel">
          <div className="content">
            <h3>É novo por aqui?</h3>
            <p>
              Bem-vindo! Faça parte do nosso sistema se cadastrando abaixo:
            </p>
            <button
              className="btn transparent"
              id="sign-up-btn"
              onClick={() => setIsSignUpMode(true)}
            >
              Cadastre-se
            </button>
          </div>
          <img src="/log.svg" className="image" alt="Log in" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>Já possui conta?</h3>
            <p>
              Entre no sistema utilizando suas credenciais para acessar nossas
              funcionalidades.
            </p>
            <button
              className="btn transparent"
              id="sign-in-btn"
              onClick={() => setIsSignUpMode(false)}
            >
              Entrar
            </button>
          </div>
          <img src="/register.svg" className="image" alt="Sign up" />
        </div>
      </div>
    </div>
  );
}
