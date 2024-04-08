import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { formSchema } from "./formSchema";
import { musicalGenres } from './data/genres';

type UserFormProps = {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
};

export default function UserForm({ onSubmit }: UserFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      artists: "",
      musicalGenres: [],
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 container flex justify-center items-center h-full flex-col"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="w-1/2">
              <FormLabel>Seu nome</FormLabel>
              <FormControl>
                <Input placeholder="Digite o seu nome..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="artists"
          render={({ field }) => (
            <FormItem className="w-1/2">
              <FormLabel>Artistas</FormLabel>
              <FormDescription>Separe os artistas por vírgula.</FormDescription>
              <FormControl>
                <Input
                  placeholder="Digite seus artistas favoritos..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="musicalGenres"
          render={({ field }) => (
            <FormItem className="w-1/2 flex flex-col">
              <FormLabel>Gêneros Favoritos</FormLabel>
              <FormDescription>
                Selecione os seus gêneros favoritos.
              </FormDescription>
              <FormControl>
                <ToggleGroup type="multiple" onValueChange={field.onChange} className='flex-wrap'>
                  {musicalGenres.map((genre) => (
                    <ToggleGroupItem
                      key={genre.value}
                      value={genre.value}
                      aria-label={`Toggle ${genre.label}`}
                    >
                      {genre.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Confirmar</Button>
      </form>
    </Form>
  );
}
