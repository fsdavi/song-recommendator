import { z } from "zod"

export const formSchema = z.object({
  username: z.string().min(2, {
    message: "O nome deve conter pelo menos 2 caracteres.",
  }),
  artists: z.string().min(2, {
    message: "O nome do artista deve conter pelo menos 2 caracteres.",
  }),
  musicalGenres: z.array(z.string()).min(1, {
    message: "Selecione pelo menos três gêneros musicais favoritos.",
  }),
})