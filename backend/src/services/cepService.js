import axios from 'axios';

export const fetchAddressByCep = async (cep) => {
  const sanitized = cep.replace(/\D/g, '');
  if (sanitized.length !== 8) {
    throw new Error('CEP inválido');
  }

  const url = `https://viacep.com.br/ws/${sanitized}/json/`;
  const { data } = await axios.get(url, { timeout: 5000 });
  if (data.erro) {
    throw new Error('CEP não encontrado');
  }

  return {
    cep: sanitized,
    street: data.logradouro,
    neighborhood: data.bairro,
    city: data.localidade,
    state: data.uf
  };
};
