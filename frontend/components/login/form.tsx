'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Spinner from '@/components/ui/spinner'
import * as React from 'react'

const formSchema = z.object({
  username: z.string().email(),
  password: z.string()
})

interface Credentials {
  username: string
  password: string
}

const LoginForm = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })
  const { mutate: credentialsMutate, isPending } = useMutation({
    mutationFn: (credentials: Credentials) =>
      signIn('credentialsProvider', {
        ...credentials,
        redirect: false
      }),
    onError: () => {
      console.log('error 1')
      toast({
        title: 'Error!',
        description: 'Something went wrong',
        variant: 'destructive'
      })
    },
    onSuccess: async (data) => {
      if (data?.error) {
        toast({
          title: 'Error!',
          description: data.error,
          variant: 'destructive'
        })
        form.resetField('password')
      } else {
        router.push('/')
      }
    }
  })

  return (
    <div className={'flex h-screen w-full items-center justify-center'}>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Sign in to use app</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((cred) => credentialsMutate(cred))}>
              <div className={'space-y-6'}>
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type={'password'} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className={'!mt-10 flex h-10 items-center justify-center'}>
                {isPending ? (
                  <Spinner />
                ) : (
                  <Button type={'submit'} className={'w-full'}>
                    Log in
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginForm
