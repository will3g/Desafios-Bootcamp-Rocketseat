import Event from '../models/Event';

class OrganizingController {
  async index(req, res) {
    const meetups = await Event.findAll({ where: { user_id: req.userId } });

    return res.json(meetups);
  }
}