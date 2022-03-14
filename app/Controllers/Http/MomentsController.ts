import { v4 as uuidv4 } from 'uuid'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Moment from 'App/Models/Moment'

import Application from '@ioc:Adonis/Core/Application'

export default class MomentsController {
  //validação de imagem
  private validationOptions = {
    types: ['image'],
    size: '2mb',
  }

  //cadastrar itens e imagens
  public async store({ request, response }: HttpContextContract) {
    const body = request.body()

    //parte da imagem
    const image = request.file('image', this.validationOptions)

    if (image) {
      const imageName = `${uuidv4()}.${image.extname}`

      await image.move(Application.tmpPath('uploads'), {
        name: imageName,
      })

      body.image = imageName

      //imagem termina aqui
    }
    const moment = await Moment.create(body)

    response.status(201)
    return {
      msg: 'Momento criado com sucesso',
      data: moment,
    }
  }

  //pegando todos os itens cadastrados
  public async index() {
    const moments = await Moment.all()

    return {
      data: moments,
    }
  }

  //pegando cadastro por id
  public async show({ params }: HttpContextContract) {

    try {
      const moment = await Moment.findOrFail(params.id)

      return {
        data: moment,
      }
    }
    catch (error) {
      return { error: "Item não encontrado" }
    }
  }
  //deletar os itens selecionados por id
  public async destroy({ params }: HttpContextContract) {
    try {
      const moment = await Moment.findOrFail(params.id)

      await moment.delete()

      return {
        message: "Item excluído com sucesso",
        data: moment,
      }
    }
    catch (error) {
      return { error: "Falha ao deletar o item" }
    }
  }

  //atualizar os arquivos

  public async update({ params, request }: HttpContextContract) {

    try {
      const body = request.body()

      const moment = await Moment.findOrFail(params.id)
  
      moment.title = body.title
      moment.description = body.description
  
  
      if (moment.image != body.image || !moment.image) {
        const image = request.file('image', this.validationOptions)
  
  
        if (image) {
          
          const imageName = `${uuidv4()}.${image.extname}`
  
          await image.move(Application.tmpPath('uploads'), {
            name: imageName,
          })
          
          moment.image = imageName
        }
      }
  
      await moment.save()
  
      return {
        message: "Momento atualizado com sucesso",
        data: moment,
      }


    } catch (err) {
      return {
        err: "Não foi possivel atualizar"
      }
    }
   
  }
}
