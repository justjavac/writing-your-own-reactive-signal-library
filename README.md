# Writing Your Own Reactive Signal Library

文章
[Writing Your Own Reactive Signal Library](https://www.lksh.dev/blog/writing-your-own-reactive-signal-library/)

本仓库是它的源码和 Demo。

## 概述

这篇文章讨论了最近前端界对于精细化反应性的新兴关注，精细化反应性是一种通过使用三个主要的原语（signal、effect
和 memo）来构建反应式用户界面的方式。近期，像 Angular、Preact 和 Qwik
等框架也加入了 signal 的支持，当然，SolidJS
作为作者的首选框架，也在前端框架中引领了 signal 的流行趋势。

接着文章介绍了 signal 是什么以及为什么需要创建自己的 signal。Signal
是事件发射器，它们包含一系列订阅。当信号值发生变化时，它们会通知它们的订阅者。为了更好地理解
SolidJS 和反应性，我们可以自己编写 signal。

然后，文章详细地讲解了如何创建自己的
signal。基本的反应性系统需要两个原语：`createSignal` 和
`createEffect`。`createSignal` 用于读取和设置反应性值，`createEffect`
用于在该值更改时运行副作用。在 `createSignal` 中，我们将初始信号值保存在 `value`
变量中，然后创建一个读取器函数 `read` 和一个写入器函数 `write`。在
`createEffect`
中，我们设置当前监听器为回调函数，并在调用回调函数时运行它。通过在 signal
的读取器函数中追踪订阅者并在写入器函数中调用订阅者函数，我们实现了反应性的效果。

最后，文章展示了如何使用我们自己创建的
signal，以及如何用它们创建简单的计数器。我们可以使用 `setCount`
来更新计数器，并使用 effect 将计数器的值设置为
`button.innerText`。整个过程展示了如何编写自己的 signal
和如何在实际应用中使用它们。

## 代码

代码在 [./signal.mjs](./signal.mjs) 文件。

### createSignal

`createSignal`
函数用于创建一个响应式变量。这个函数接受一个初始值，返回一个数组。

- 数组的第一个元素是一个读取该变量值的函数
- 第二个元素是一个设置该变量值的函数。

这个数组可以用解构赋值语法来获取这两个函数。这个函数可以用于创建一些响应式状态，比如表单的输入值，或者一些
UI 的状态。

当这个响应式变量的值被修改时，它会通知所有依赖于它的副作用函数。

### createEffect

`createEffect`
函数用于创建一个副作用函数，也就是那些当响应式变量的值发生变化时需要执行的函数。

它接受一个函数作为参数，该函数即为需要执行的副作用函数。当副作用函数被创建时，它会自动运行一次。当与它关联的响应式变量的值发生变化时，副作用函数会被再次执行。

可以使用 `createEffect` 函数来创建一些需要自动响应数据变化的业务逻辑。

### 其他

这段代码还定义了一些类型别名 `ReadSignal`、`WriteSignal` 和
`Signal`，用于定义这些函数所使用的类型。

- `ReadSignal` 表示读取响应式变量的函数类型，
- `WriteSignal` 表示设置响应式变量的函数类型，
- `Signal` 表示一个响应式变量的类型，是一个由 `ReadSignal` 和 `WriteSignal`
  组成的元组类型。
