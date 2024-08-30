# MMP

- Modular Minecraft Proxy

# How does this differ from other proxies (such as SMP)?

## Type Safety

Instead of JavaScript, TypeScript is used which allows for type checking of the code and less bugs.

No more cleint, sever or posiotin!

## Multi-Threading

For every client that connects a new thread is created.

While also offering minimal performance gains (as there probably isn't (and shouldn't) be ever more then one client) makes it so that program instances client-based instead of being shared between all clients.

This makes a Singleton-like architecture possible without needing to worry about multiple instances of the same plugin and explicit declaration of dependencies.

Data can be sent between instances via [IPC](https://en.wikipedia.org/wiki/Inter-process_communication).

## Modularity

Other proxies came pre-installed with plugins which most time were private meaning that you couldn't share the project with the public.

They also had a monolithic boilerplate-y settings file with many placeholders.

This repo is only the loader which has only the responsibility of proxy-ing the connection, manipulating packets, managing threads and loading modules.

## Installation, Development and Distribution

The dynamic nature of the project will make it very easy to install, develop and distribute modules.

To install simply `cd` into to the `modules` directory create add the module(s) there (via `git clone` or similar).

To develop simply create a sub-directory under the `modules` directory, you can test your module by running the loader.

To distribute simply create a repository in the `modules` directory and then share it via something like [github](https://github.com/).
