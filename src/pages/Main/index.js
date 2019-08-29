import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FaGithubAlt, FaPlus, FaTrashAlt, FaInfoCircle } from 'react-icons/fa';

import Container from '../../components/Container';
import { Form, SubmitButton, List, IconsContainer } from './styles';
import api from '../../services/api';
import Loader from '../../components/Loader';

class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    error: false,
  };

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    try {
      const { newRepo, repositories } = this.state;

      if (repositories.find(repo => repo.name === newRepo)) {
        throw new Error('O repositório já está listado');
      }

      this.setState({ loading: true });

      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: false,
        error: false,
      });
    } catch (err) {
      this.setState({ loading: false, error: true });
    }
  };

  handleDelete = repo => {
    const { repositories } = this.state;

    this.setState({ repositories: repositories.filter(r => r !== repo) });
  };

  render() {
    const { newRepo, repositories, loading, error } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} error={error}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />

          <SubmitButton loading={loading}>
            {loading ? <Loader size={14} /> : <FaPlus color="#fff" size={14} />}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repo => (
            <li key={repo.name}>
              <span>{repo.name}</span>
              <IconsContainer>
                <Link to={`/repository/${encodeURIComponent(repo.name)}`}>
                  <FaInfoCircle size={16} />
                </Link>
                <FaTrashAlt size={16} onClick={() => this.handleDelete(repo)} />
              </IconsContainer>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}

export default Main;
