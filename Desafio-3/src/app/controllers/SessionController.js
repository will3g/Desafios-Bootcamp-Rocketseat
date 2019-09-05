import jwt from 'jsonwebtoken';

import * as Yup  from 'yup';
import Meetuper from '../models/User';
import configAut from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const { email, password } = req.body;

    const meetuper = await Meetuper.findOne({  where: { email } });

    if(!meetuper) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if(!(await meetuper.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha inválida' });
    }

    const { id, nome } = meetuper;

    return res.json({
      meetuper: {
        id,
        nome,
        email,
      },
      token: jwt.sign({ id }, configAut.secret, {
        expiresIn: configAut.expiresIn},
      ),
    });
  }
}

export default new SessionController();