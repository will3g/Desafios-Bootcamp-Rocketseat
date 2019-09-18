import { Op } from 'sequelize';
import User from '../models/User';

import EventMeetup from '../models/Event';
import Subscription from '../models/Subscription';

import SubscriptionMail from '../jobs/SubscriptionMail';
import Queue from '../../lib/Queue';

class SubscriptionEventMeetupController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: EventMeetup,
          where: {
            data: {
              [Op.gt]: new Date(),
            },
          },
          required: true,
        },
      ],
      order: [[EventMeetup, 'data']],
    });

    return res.json(subscriptions);
  }
  
  async store(req, res) {
    const user = await User.findByPk(req.userId);
    const meetup = await EventMeetup.findByPk(req.params.meetupId, {
      include: [User],
    });
    
    if(meetup.user_id === req.userId) {
      return res.status(400).json({ error: "Não é possível você se cadastrar no seu Meetup!" });
    }

    if(meetup.past) {
      return res.status(400).json({ error: "Não é possível se increver nesse Meetup" });
    }

    const date_available = await Subscription.findOne({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: EventMeetup,
          required: true,
          where: {
            data: meetup.data,
          },
        },
      ],
    });

   if(date_available) {
     return res.status(400).json({ error: "Não é possível se inscrever duas vezes" });
   }

    const subscription = await Subscription.create({
      user_id: user.id,
      meetup_id: meetup.id,
    });

    await Queue.add(SubscriptionMail.key, {
      subscription,
    });
    
    return res.json(subscription);
  }
}

export default new SubscriptionEventMeetupController();