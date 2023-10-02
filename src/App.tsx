import "./App.css"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"

const schema = z.object({
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
    .min(5, "A senha deve conter no mínimo 6 caracteres")
})

type userSchema = z.infer<typeof schema>

function App() {
  const [value, setValue] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<userSchema>({ resolver: zodResolver(schema) })

  function sendData(data: object) {
    setValue(JSON.stringify(data, null, 2))
  }

  return (
    <div id="container">
      <div className="content">
        <div className="headline">
          <h1>Advanced Form</h1>
          <h4>React-Hook-Form and Zod</h4>
        </div>

        <form onSubmit={handleSubmit(sendData)} className="form">
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
