import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import configAlt from '../../config/auth';

export default async(req, res, next) => {
  const headerAlt = req.headers.authorization;

  if(!headerAlt) {
    return res.status(401).json({ error: 'Token não encontrado' });
  }

  const [, token] = headerAlt.split(' ');

  try {
    const decodificacao = await promisify(jwt.verify)(token, configAlt.secret);

    req.userId = decodificacao.id;
    return next();
  
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};