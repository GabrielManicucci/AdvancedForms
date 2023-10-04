import "./App.css"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { supabase } from "./lib/supabase"

const schema = z.object({
  avatar: z
    .instanceof(FileList)
    .transform(list => list.item(0)!)
    .refine(file => file !== null, "Escolha uma foto")
    .refine(
      file => file?.size <= 5 * 1024 * 1024,
      "O arquivo pode ter no máximo 5Mb"
    ),
  name: z
    .string()
    .nonempty({ message: "Nome é obrigatório" })
    .transform(name =>
      name
        .trim()
        .split(" ")
        .map(word => word[0].toLocaleUpperCase().concat(word.slice(1)))
        .join(" ")
    ),
  email: z
    .string()
    .nonempty("O email é obrigatório")
    .email("Formato de email inválido"),
  senha: z
    .string()
    .nonempty("A senha é obrigatória")
    .min(6, "A senha deve conter no mínimo 6 caracteres"),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty("Insira uma tecnologia"),
        knowledge: z.coerce.number().min(1).max(100)
      })
    )
    .min(1, "insira pelo menos 1 tecnologia")
})

type userSchema = z.infer<typeof schema>

function App() {
  const [value, setValue] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm<userSchema>({ resolver: zodResolver(schema) })

  const { fields, append } = useFieldArray({
    control,
    name: "techs"
  })

  async function sendData(data: userSchema) {
    console.log(data.avatar)
    await supabase.storage
      .from("forms-react")
      .upload(data.avatar.name, data.avatar)

    setValue(JSON.stringify(data, null, 2))
  }

  function addTech() {
    append({ title: "", knowledge: 0 })
  }

  return (
    <div id="container">
      <div className="content">
        <div className="headline">
          <h1>Advanced Form</h1>
          <h4>React-Hook-Form and Zod</h4>
        </div>

        <form onSubmit={handleSubmit(sendData)} className="form">
          <div className="field input">
            <label htmlFor="Avatar">Avatar</label>
            <input id="avatarInput" type="file" {...register("avatar")} />
            {errors.avatar && (
              <span className="errorMessage">{errors.avatar.message}</span>
            )}
          </div>

          <div className="field">
            <label htmlFor="name">Nome</label>
            <input type="text" id="name" {...register("name")} />
            {errors.name && (
              <span className="errorMessage">{errors.name.message}</span>
            )}
          </div>
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" {...register("email")} />
            {errors.email && (
              <span className="errorMessage">{errors.email.message}</span>
            )}
          </div>
          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input type="password" id="senha" {...register("senha")} />
            {errors.senha && (
              <span className="errorMessage">{errors.senha.message}</span>
            )}
          </div>

          <div className="techsContainer">
            <label htmlFor="techs">
              Tecnologias
              <button type="button" onClick={addTech}>
                Adicionar
              </button>
            </label>

            {fields.map((field, index) => {
              return (
                <div className="techFields" key={field.id}>
                  <div className="techInput">
                    <input
                      accept="image/*"
                      type="text"
                      {...register(`techs.${index}.title`)}
                    />

                    {errors.techs?.[index]?.title && (
                      <span className="errorMessage">
                        {errors.techs?.[index]?.title?.message}
                      </span>
                    )}
                  </div>

                  <div className="number">
                    <input
                      type="number"
                      {...register(`techs.${index}.knowledge`)}
                    />

                    {errors.techs?.[index]?.knowledge && (
                      <span className="errorMessage">
                        {errors.techs?.[index]?.knowledge?.message}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}

            {errors.techs && (
              <span className="errorMessage">{errors.techs.message}</span>
            )}
          </div>

          <div className="button">
            <input type="submit" className="submitButton" />
          </div>
        </form>

        <pre className="data">{value}</pre>
      </div>
    </div>
  )
}

export default App
